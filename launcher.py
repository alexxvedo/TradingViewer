#!/usr/bin/env python3
"""
MT5 Portable Launcher - Interfaz principal para gestionar múltiples cuentas MT5 en modo portable
Crea carpetas temporales independientes para cada instancia
"""

import sys
import os
import json
import subprocess
import tempfile
import shutil
import sqlite3
import threading
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QTabWidget, QTableWidget, QTableWidgetItem, QPushButton, QLabel,
    QTextEdit, QGroupBox, QGridLayout, QCheckBox, QSpinBox, QLineEdit,
    QFileDialog, QMessageBox, QHeaderView, QSplitter, QStatusBar,
    QProgressBar, QComboBox, QTreeWidget, QTreeWidgetItem
)
from PySide6.QtCore import (
    QTimer, QThread, Signal, Qt, QSize, QSettings
)
from PySide6.QtGui import QFont, QIcon, QPixmap, QAction
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import psutil


class ConfigWatcher(FileSystemEventHandler):
    """Monitorea cambios en el archivo de configuración"""
    
    def __init__(self, callback):
        super().__init__()
        self.callback = callback
    
    def on_modified(self, event):
        if event.src_path.endswith('config.json'):
            self.callback()


class WorkerProcess:
    """Representa un proceso worker individual con su carpeta temporal"""
    
    def __init__(self, account_config: Dict[str, Any]):
        self.config = account_config
        self.process: Optional[subprocess.Popen] = None
        self.temp_dir: Optional[str] = None
        self.status = "Stopped"
        self.last_update = None
        self.db_path = None
        
    def create_temp_directory(self) -> bool:
        """Crea un directorio temporal para esta instancia"""
        try:
            if self.temp_dir and os.path.exists(self.temp_dir):
                return True
                
            self.temp_dir = tempfile.mkdtemp(prefix=f"mt5_{self.config['login']}_")
            self.db_path = os.path.join(self.temp_dir, f"mt5_data_{self.config['login']}.db")
            print(f"Directorio temporal creado: {self.temp_dir}")
            return True
            
        except Exception as e:
            print(f"Error creando directorio temporal: {e}")
            return False
    
    def cleanup_temp_directory(self):
        """Limpia el directorio temporal"""
        if self.temp_dir and os.path.exists(self.temp_dir):
            try:
                shutil.rmtree(self.temp_dir)
                print(f"Directorio temporal eliminado: {self.temp_dir}")
                self.temp_dir = None
                self.db_path = None
            except Exception as e:
                print(f"Error eliminando directorio temporal: {e}")
    
    def start(self, worker_script_path: str) -> bool:
        """Inicia el proceso worker"""
        if self.process and self.process.poll() is None:
            return False  # Ya está ejecutándose
            
        try:
            # Crear directorio temporal
            if not self.create_temp_directory():
                return False
            
            # Preparar argumentos para el worker
            args = [
                sys.executable, worker_script_path,
                '--login', str(self.config['login']),
                '--password', self.config['password'],
                '--server', self.config['server'],
                '--terminal_path', self.config['terminal_path'],
                '--temp_dir', self.temp_dir,
                '--update_interval', str(self.config.get('update_interval', 5))
            ]
            
            # Configurar para ocultar la ventana en Windows
            startupinfo = None
            if sys.platform == 'win32':
                startupinfo = subprocess.STARTUPINFO()
                startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
                startupinfo.wShowWindow = subprocess.SW_HIDE
            
            # Iniciar el proceso en el directorio temporal
            self.process = subprocess.Popen(
                args,
                cwd=self.temp_dir,
                startupinfo=startupinfo,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            self.status = "Starting"
            return True
            
        except Exception as e:
            self.status = f"Error: {e}"
            return False
    
    def stop(self) -> bool:
        """Detiene el proceso worker y limpia recursos"""
        if self.process:
            try:
                self.process.terminate()
                # Esperar un poco para que termine gracefully
                try:
                    self.process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    # Forzar terminación si no responde
                    self.process.kill()
                    self.process.wait()
                
                self.process = None
            except Exception as e:
                print(f"Error stopping process: {e}")
        
        # Limpiar directorio temporal
        self.cleanup_temp_directory()
        self.status = "Stopped"
        return True
    
    def is_running(self) -> bool:
        """Verifica si el proceso está ejecutándose"""
        if not self.process:
            return False
        return self.process.poll() is None
    
    def get_data_from_db(self) -> Dict[str, Any]:
        """Lee los datos desde la base de datos SQLite"""
        if not self.db_path or not os.path.exists(self.db_path):
            return {}
        
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            data = {}
            
            # Obtener información de cuenta
            cursor.execute('SELECT * FROM account_info ORDER BY timestamp DESC LIMIT 1')
            account_row = cursor.fetchone()
            if account_row:
                data['account_info'] = {
                    'login': account_row[1],
                    'server': account_row[2],
                    'name': account_row[3],
                    'company': account_row[4],
                    'currency': account_row[5],
                    'leverage': account_row[6],
                    'balance': account_row[7],
                    'equity': account_row[8],
                    'margin': account_row[9],
                    'margin_free': account_row[10],
                    'margin_level': account_row[11],
                    'profit': account_row[12]
                }
            
            # Obtener posiciones
            cursor.execute('SELECT * FROM positions ORDER BY timestamp DESC')
            positions_rows = cursor.fetchall()
            data['positions'] = []
            for row in positions_rows:
                data['positions'].append({
                    'ticket': row[0],
                    'symbol': row[1],
                    'type': row[2],
                    'volume': row[3],
                    'price_open': row[4],
                    'price_current': row[5],
                    'profit': row[6],
                    'swap': row[7],
                    'commission': row[8],
                    'time': row[9],
                    'comment': row[10]
                })
            
            # Obtener estado del worker
            cursor.execute('SELECT * FROM worker_status ORDER BY last_update DESC LIMIT 1')
            status_row = cursor.fetchone()
            if status_row:
                self.status = status_row[2]
                self.last_update = datetime.fromisoformat(status_row[4])
            
            conn.close()
            return data
            
        except Exception as e:
            print(f"Error leyendo base de datos: {e}")
            return {}


class AccountsTable(QTableWidget):
    """Tabla personalizada para mostrar cuentas"""
    
    def __init__(self):
        super().__init__()
        self.setup_table()
    
    def setup_table(self):
        """Configura la tabla"""
        headers = [
            "Nombre", "Login", "Servidor", "Estado", "Balance", "Equity", 
            "Posiciones", "Profit", "Directorio Temporal", "Acciones"
        ]
        self.setColumnCount(len(headers))
        self.setHorizontalHeaderLabels(headers)
        
        # Configurar el header
        header = self.horizontalHeader()
        header.setSectionResizeMode(QHeaderView.ResizeToContents)
        header.setSectionResizeMode(0, QHeaderView.Stretch)  # Nombre
        
        # Configurar selección
        self.setSelectionBehavior(QTableWidget.SelectRows)
        self.setAlternatingRowColors(True)
    
    def update_account_row(self, row: int, worker: WorkerProcess):
        """Actualiza una fila de la tabla con datos del worker"""
        config = worker.config
        data = worker.get_data_from_db()
        account_info = data.get('account_info', {})
        
        # Nombre
        self.setItem(row, 0, QTableWidgetItem(config.get('name', f"Cuenta {config['login']}")))
        
        # Login
        self.setItem(row, 1, QTableWidgetItem(str(config['login'])))
        
        # Servidor
        self.setItem(row, 2, QTableWidgetItem(config['server']))
        
        # Estado
        status_item = QTableWidgetItem(worker.status)
        if worker.status == "Connected" or worker.status == "Running":
            status_item.setBackground(Qt.green)
        elif worker.status == "Starting":
            status_item.setBackground(Qt.yellow)
        elif "Error" in worker.status:
            status_item.setBackground(Qt.red)
        self.setItem(row, 3, status_item)
        
        # Balance
        balance = account_info.get('balance', 0)
        self.setItem(row, 4, QTableWidgetItem(f"${balance:,.2f}"))
        
        # Equity
        equity = account_info.get('equity', 0)
        self.setItem(row, 5, QTableWidgetItem(f"${equity:,.2f}"))
        
        # Posiciones
        positions_count = len(data.get('positions', []))
        self.setItem(row, 6, QTableWidgetItem(str(positions_count)))
        
        # Profit
        profit = account_info.get('profit', 0)
        profit_item = QTableWidgetItem(f"${profit:,.2f}")
        if profit > 0:
            profit_item.setBackground(Qt.green)
        elif profit < 0:
            profit_item.setBackground(Qt.red)
        self.setItem(row, 7, profit_item)
        
        # Directorio temporal
        temp_dir = worker.temp_dir if worker.temp_dir else "No creado"
        self.setItem(row, 8, QTableWidgetItem(temp_dir))


class MT5PortableLauncher(QMainWindow):
    """Ventana principal del launcher portable"""
    
    def __init__(self):
        super().__init__()
        self.workers: Dict[int, WorkerProcess] = {}
        self.config_file = "config.json"
        self.config_observer = None
        self.settings = QSettings("MT5PortableLauncher", "TradingLauncher")
        
        self.setup_ui()
        self.setup_config_watcher()
        self.load_config()
        
        # Timer para actualizar la UI
        self.update_timer = QTimer()
        self.update_timer.timeout.connect(self.update_ui)
        self.update_timer.start(2000)  # Actualizar cada 2 segundos
    
    def setup_ui(self):
        """Configura la interfaz de usuario"""
        self.setWindowTitle("MT5 Portable Launcher v1.0")
        self.setMinimumSize(1400, 900)
        
        # Widget central
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # Layout principal
        main_layout = QVBoxLayout(central_widget)
        
        # Barra de herramientas
        toolbar_layout = QHBoxLayout()
        
        self.start_all_btn = QPushButton("▶ Iniciar Todo")
        self.start_all_btn.clicked.connect(self.start_all_workers)
        self.start_all_btn.setStyleSheet("QPushButton { background-color: #4CAF50; color: white; font-weight: bold; }")
        toolbar_layout.addWidget(self.start_all_btn)
        
        self.stop_all_btn = QPushButton("⏹ Detener Todo")
        self.stop_all_btn.clicked.connect(self.stop_all_workers)
        self.stop_all_btn.setStyleSheet("QPushButton { background-color: #f44336; color: white; font-weight: bold; }")
        toolbar_layout.addWidget(self.stop_all_btn)
        
        self.reload_config_btn = QPushButton("🔄 Recargar Config")
        self.reload_config_btn.clicked.connect(self.load_config)
        toolbar_layout.addWidget(self.reload_config_btn)
        
        self.edit_config_btn = QPushButton("✏ Editar Config")
        self.edit_config_btn.clicked.connect(self.edit_config)
        toolbar_layout.addWidget(self.edit_config_btn)
        
        self.cleanup_btn = QPushButton("🧹 Limpiar Temporales")
        self.cleanup_btn.clicked.connect(self.cleanup_all_temp_dirs)
        toolbar_layout.addWidget(self.cleanup_btn)
        
        toolbar_layout.addStretch()
        
        # Indicador de cuentas activas
        self.accounts_status_label = QLabel("Cuentas: 0/0 activas")
        self.accounts_status_label.setStyleSheet("QLabel { font-weight: bold; color: #2196F3; }")
        toolbar_layout.addWidget(self.accounts_status_label)
        
        main_layout.addLayout(toolbar_layout)
        
        # Tabs principales
        self.tab_widget = QTabWidget()
        main_layout.addWidget(self.tab_widget)
        
        # Tab de cuentas
        self.accounts_tab = self.create_accounts_tab()
        self.tab_widget.addTab(self.accounts_tab, "📊 Cuentas")
        
        # Tab de posiciones
        self.positions_tab = self.create_positions_tab()
        self.tab_widget.addTab(self.positions_tab, "📈 Posiciones")
        
        # Tab de directorios temporales
        self.temp_dirs_tab = self.create_temp_dirs_tab()
        self.tab_widget.addTab(self.temp_dirs_tab, "📁 Directorios Temporales")
        
        # Tab de logs
        self.logs_tab = self.create_logs_tab()
        self.tab_widget.addTab(self.logs_tab, "📋 Logs")
        
        # Barra de estado
        self.status_bar = QStatusBar()
        self.setStatusBar(self.status_bar)
        self.status_bar.showMessage("Listo - Launcher Portable MT5")
    
    def create_accounts_tab(self) -> QWidget:
        """Crea el tab de cuentas"""
        widget = QWidget()
        layout = QVBoxLayout(widget)
        
        # Información general
        info_layout = QHBoxLayout()
        
        self.total_balance_label = QLabel("Balance Total: $0.00")
        self.total_balance_label.setStyleSheet("QLabel { font-size: 14px; font-weight: bold; color: #4CAF50; }")
        info_layout.addWidget(self.total_balance_label)
        
        self.total_equity_label = QLabel("Equity Total: $0.00")
        self.total_equity_label.setStyleSheet("QLabel { font-size: 14px; font-weight: bold; color: #2196F3; }")
        info_layout.addWidget(self.total_equity_label)
        
        self.total_profit_label = QLabel("Profit Total: $0.00")
        self.total_profit_label.setStyleSheet("QLabel { font-size: 14px; font-weight: bold; }")
        info_layout.addWidget(self.total_profit_label)
        
        info_layout.addStretch()
        layout.addLayout(info_layout)
        
        # Tabla de cuentas
        self.accounts_table = AccountsTable()
        layout.addWidget(self.accounts_table)
        
        return widget
    
    def create_positions_tab(self) -> QWidget:
        """Crea el tab de posiciones"""
        widget = QWidget()
        layout = QVBoxLayout(widget)
        
        # Tabla de posiciones
        self.positions_table = QTableWidget()
        self.positions_table.setColumnCount(9)
        self.positions_table.setHorizontalHeaderLabels([
            "Cuenta", "Ticket", "Símbolo", "Tipo", "Volumen", 
            "Precio Apertura", "Precio Actual", "Profit", "Tiempo"
        ])
        
        header = self.positions_table.horizontalHeader()
        header.setSectionResizeMode(QHeaderView.ResizeToContents)
        
        layout.addWidget(self.positions_table)
        
        return widget
    
    def create_temp_dirs_tab(self) -> QWidget:
        """Crea el tab de directorios temporales"""
        widget = QWidget()
        layout = QVBoxLayout(widget)
        
        # Información sobre directorios temporales
        info_label = QLabel("Directorios temporales creados para cada instancia MT5:")
        info_label.setStyleSheet("QLabel { font-weight: bold; margin-bottom: 10px; }")
        layout.addWidget(info_label)
        
        # Tree widget para mostrar estructura de directorios
        self.temp_dirs_tree = QTreeWidget()
        self.temp_dirs_tree.setHeaderLabels(["Directorio", "Tamaño", "Estado"])
        layout.addWidget(self.temp_dirs_tree)
        
        # Botones para gestión de directorios
        buttons_layout = QHBoxLayout()
        
        refresh_btn = QPushButton("🔄 Actualizar")
        refresh_btn.clicked.connect(self.update_temp_dirs_tree)
        buttons_layout.addWidget(refresh_btn)
        
        open_btn = QPushButton("📂 Abrir Seleccionado")
        open_btn.clicked.connect(self.open_selected_temp_dir)
        buttons_layout.addWidget(open_btn)
        
        buttons_layout.addStretch()
        layout.addLayout(buttons_layout)
        
        return widget
    
    def create_logs_tab(self) -> QWidget:
        """Crea el tab de logs"""
        widget = QWidget()
        layout = QVBoxLayout(widget)
        
        # Área de logs
        self.logs_text = QTextEdit()
        self.logs_text.setReadOnly(True)
        self.logs_text.setFont(QFont("Consolas", 9))
        layout.addWidget(self.logs_text)
        
        # Botones para logs
        logs_buttons_layout = QHBoxLayout()
        
        clear_btn = QPushButton("🗑 Limpiar Logs")
        clear_btn.clicked.connect(self.logs_text.clear)
        logs_buttons_layout.addWidget(clear_btn)
        
        export_btn = QPushButton("💾 Exportar Logs")
        export_btn.clicked.connect(self.export_logs)
        logs_buttons_layout.addWidget(export_btn)
        
        logs_buttons_layout.addStretch()
        layout.addLayout(logs_buttons_layout)
        
        return widget
    
    def setup_config_watcher(self):
        """Configura el monitor de cambios en config.json"""
        self.config_observer = Observer()
        handler = ConfigWatcher(self.load_config)
        self.config_observer.schedule(handler, ".", recursive=False)
        self.config_observer.start()
    
    def load_config(self):
        """Carga la configuración desde config.json"""
        try:
            if not os.path.exists(self.config_file):
                self.log_message("⚠ Archivo config.json no encontrado")
                return
            
            with open(self.config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            # Actualizar workers
            new_workers = {}
            for account_config in config:
                if not account_config.get('enabled', True):
                    continue
                    
                login = account_config['login']
                if login in self.workers:
                    # Actualizar configuración existente
                    self.workers[login].config = account_config
                    new_workers[login] = self.workers[login]
                else:
                    # Crear nuevo worker
                    new_workers[login] = WorkerProcess(account_config)
            
            # Detener workers que ya no están en la configuración
            for login, worker in self.workers.items():
                if login not in new_workers:
                    worker.stop()
                    self.log_message(f"🔴 Worker {login} eliminado de la configuración")
            
            self.workers = new_workers
            self.update_accounts_table()
            self.log_message(f"✅ Configuración cargada: {len(self.workers)} cuentas")
            
        except Exception as e:
            self.log_message(f"❌ Error cargando configuración: {e}")
    
    def update_accounts_table(self):
        """Actualiza la tabla de cuentas"""
        self.accounts_table.setRowCount(len(self.workers))
        
        total_balance = 0
        total_equity = 0
        total_profit = 0
        
        for row, (login, worker) in enumerate(self.workers.items()):
            self.accounts_table.update_account_row(row, worker)
            
            # Calcular totales
            data = worker.get_data_from_db()
            account_info = data.get('account_info', {})
            total_balance += account_info.get('balance', 0)
            total_equity += account_info.get('equity', 0)
            total_profit += account_info.get('profit', 0)
            
            # Agregar botones de acción
            actions_widget = QWidget()
            actions_layout = QHBoxLayout(actions_widget)
            actions_layout.setContentsMargins(5, 5, 5, 5)
            
            start_btn = QPushButton("▶")
            start_btn.setToolTip("Iniciar")
            start_btn.clicked.connect(lambda checked, l=login: self.start_worker(l))
            start_btn.setEnabled(not worker.is_running())
            start_btn.setStyleSheet("QPushButton { background-color: #4CAF50; color: white; }")
            actions_layout.addWidget(start_btn)
            
            stop_btn = QPushButton("⏹")
            stop_btn.setToolTip("Detener")
            stop_btn.clicked.connect(lambda checked, l=login: self.stop_worker(l))
            stop_btn.setEnabled(worker.is_running())
            stop_btn.setStyleSheet("QPushButton { background-color: #f44336; color: white; }")
            actions_layout.addWidget(stop_btn)
            
            self.accounts_table.setCellWidget(row, 9, actions_widget)
        
        # Actualizar labels de totales
        self.total_balance_label.setText(f"Balance Total: ${total_balance:,.2f}")
        self.total_equity_label.setText(f"Equity Total: ${total_equity:,.2f}")
        
        profit_color = "#4CAF50" if total_profit >= 0 else "#f44336"
        self.total_profit_label.setText(f"Profit Total: ${total_profit:,.2f}")
        self.total_profit_label.setStyleSheet(f"QLabel {{ font-size: 14px; font-weight: bold; color: {profit_color}; }}")
    
    def update_positions_table(self):
        """Actualiza la tabla de posiciones"""
        all_positions = []
        
        for login, worker in self.workers.items():
            data = worker.get_data_from_db()
            positions = data.get('positions', [])
            for pos in positions:
                pos['account_login'] = login
                all_positions.append(pos)
        
        self.positions_table.setRowCount(len(all_positions))
        
        for row, pos in enumerate(all_positions):
            self.positions_table.setItem(row, 0, QTableWidgetItem(str(pos['account_login'])))
            self.positions_table.setItem(row, 1, QTableWidgetItem(str(pos['ticket'])))
            self.positions_table.setItem(row, 2, QTableWidgetItem(pos['symbol']))
            self.positions_table.setItem(row, 3, QTableWidgetItem("Buy" if pos['type'] == 0 else "Sell"))
            self.positions_table.setItem(row, 4, QTableWidgetItem(str(pos['volume'])))
            self.positions_table.setItem(row, 5, QTableWidgetItem(f"{pos['price_open']:.5f}"))
            self.positions_table.setItem(row, 6, QTableWidgetItem(f"{pos['price_current']:.5f}"))
            
            profit_item = QTableWidgetItem(f"${pos['profit']:.2f}")
            if pos['profit'] > 0:
                profit_item.setBackground(Qt.green)
            elif pos['profit'] < 0:
                profit_item.setBackground(Qt.red)
            self.positions_table.setItem(row, 7, profit_item)
            
            # Convertir timestamp a fecha legible
            time_str = datetime.fromtimestamp(pos['time']).strftime("%Y-%m-%d %H:%M:%S")
            self.positions_table.setItem(row, 8, QTableWidgetItem(time_str))
    
    def update_temp_dirs_tree(self):
        """Actualiza el árbol de directorios temporales"""
        self.temp_dirs_tree.clear()
        
        for login, worker in self.workers.items():
            if worker.temp_dir and os.path.exists(worker.temp_dir):
                # Calcular tamaño del directorio
                total_size = 0
                for dirpath, dirnames, filenames in os.walk(worker.temp_dir):
                    for filename in filenames:
                        filepath = os.path.join(dirpath, filename)
                        try:
                            total_size += os.path.getsize(filepath)
                        except:
                            pass
                
                size_str = f"{total_size / 1024 / 1024:.1f} MB"
                status = "Activo" if worker.is_running() else "Inactivo"
                
                item = QTreeWidgetItem([worker.temp_dir, size_str, status])
                self.temp_dirs_tree.addTopLevelItem(item)
    
    def open_selected_temp_dir(self):
        """Abre el directorio temporal seleccionado"""
        current_item = self.temp_dirs_tree.currentItem()
        if current_item:
            temp_dir = current_item.text(0)
            try:
                if sys.platform == 'win32':
                    os.startfile(temp_dir)
                else:
                    subprocess.run(['xdg-open', temp_dir])
            except Exception as e:
                self.log_message(f"❌ Error abriendo directorio: {e}")
    
    def start_worker(self, login: int):
        """Inicia un worker específico"""
        if login not in self.workers:
            return
        
        worker = self.workers[login]
        worker_script = os.path.join(os.path.dirname(__file__), "worker.py")
        
        if worker.start(worker_script):
            self.log_message(f"🟢 Iniciando worker para cuenta {login}")
        else:
            self.log_message(f"❌ Error iniciando worker para cuenta {login}")
    
    def stop_worker(self, login: int):
        """Detiene un worker específico"""
        if login not in self.workers:
            return
        
        worker = self.workers[login]
        if worker.stop():
            self.log_message(f"🔴 Worker detenido para cuenta {login}")
        else:
            self.log_message(f"❌ Error deteniendo worker para cuenta {login}")
    
    def start_all_workers(self):
        """Inicia todos los workers"""
        for login in self.workers:
            if not self.workers[login].is_running():
                self.start_worker(login)
    
    def stop_all_workers(self):
        """Detiene todos los workers"""
        for login in self.workers:
            if self.workers[login].is_running():
                self.stop_worker(login)
    
    def cleanup_all_temp_dirs(self):
        """Limpia todos los directorios temporales no utilizados"""
        reply = QMessageBox.question(
            self, 
            "Confirmar Limpieza", 
            "¿Está seguro de que desea limpiar todos los directorios temporales?\n"
            "Esta acción detendrá todos los workers activos.",
            QMessageBox.Yes | QMessageBox.No
        )
        
        if reply == QMessageBox.Yes:
            self.stop_all_workers()
            time.sleep(2)  # Esperar a que se detengan
            
            count = 0
            for worker in self.workers.values():
                if worker.temp_dir:
                    worker.cleanup_temp_directory()
                    count += 1
            
            self.log_message(f"🧹 Limpiados {count} directorios temporales")
    
    def edit_config(self):
        """Abre el editor de configuración"""
        try:
            if sys.platform == 'win32':
                os.startfile(self.config_file)
            else:
                subprocess.run(['xdg-open', self.config_file])
        except Exception as e:
            self.log_message(f"❌ Error abriendo editor: {e}")
    
    def export_logs(self):
        """Exporta los logs a un archivo"""
        try:
            filename, _ = QFileDialog.getSaveFileName(
                self, "Exportar Logs", f"mt5_logs_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt",
                "Text Files (*.txt)"
            )
            if filename:
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(self.logs_text.toPlainText())
                self.log_message(f"📁 Logs exportados a: {filename}")
        except Exception as e:
            self.log_message(f"❌ Error exportando logs: {e}")
    
    def log_message(self, message: str):
        """Agrega un mensaje al log"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        formatted_message = f"[{timestamp}] {message}"
        self.logs_text.append(formatted_message)
        print(formatted_message)  # También imprimir en consola
    
    def update_ui(self):
        """Actualiza la interfaz de usuario"""
        self.update_accounts_table()
        self.update_positions_table()
        self.update_temp_dirs_tree()
        
        # Actualizar contador de cuentas activas
        running_count = sum(1 for w in self.workers.values() if w.is_running())
        total_count = len(self.workers)
        self.accounts_status_label.setText(f"Cuentas: {running_count}/{total_count} activas")
        
        # Actualizar barra de estado
        temp_dirs_count = sum(1 for w in self.workers.values() if w.temp_dir)
        self.status_bar.showMessage(
            f"Cuentas: {running_count}/{total_count} ejecutándose | "
            f"Directorios temporales: {temp_dirs_count}"
        )
    
    def closeEvent(self, event):
        """Maneja el cierre de la aplicación"""
        reply = QMessageBox.question(
            self, 
            "Confirmar Salida", 
            "¿Desea detener todos los workers y limpiar directorios temporales antes de salir?",
            QMessageBox.Yes | QMessageBox.No | QMessageBox.Cancel
        )
        
        if reply == QMessageBox.Cancel:
            event.ignore()
            return
        elif reply == QMessageBox.Yes:
            # Detener todos los workers y limpiar
            self.stop_all_workers()
            time.sleep(1)
            for worker in self.workers.values():
                worker.cleanup_temp_directory()
        
        # Detener el monitor de configuración
        if self.config_observer:
            self.config_observer.stop()
            self.config_observer.join()
        
        event.accept()


def main():
    """Función principal"""
    app = QApplication(sys.argv)
    app.setApplicationName("MT5 Portable Launcher")
    app.setApplicationVersion("1.0")
    
    # Configurar estilo
    app.setStyle("Fusion")
    
    # Crear y mostrar la ventana principal
    launcher = MT5PortableLauncher()
    launcher.show()
    
    # Ejecutar la aplicación
    sys.exit(app.exec())


if __name__ == "__main__":
    main() 