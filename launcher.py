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
    QProgressBar, QComboBox, QTreeWidget, QTreeWidgetItem, QFrame,
    QScrollArea, QGraphicsDropShadowEffect
)
from PySide6.QtCore import (
    QTimer, QThread, Signal, Qt, QSize, QSettings, QPropertyAnimation,
    QEasingCurve, QRect
)
from PySide6.QtGui import QFont, QIcon, QPixmap, QAction, QColor, QPalette
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import psutil

# Importar estilos modernos
try:
    from modern_styles import (
        apply_modern_dark_theme, 
        get_card_style, 
        get_metric_card_style,
        get_glow_effect_style
    )
    MODERN_STYLES_AVAILABLE = True
except ImportError:
    MODERN_STYLES_AVAILABLE = False


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
        """Configura la interfaz de usuario moderna"""
        self.setWindowTitle("🚀 TradingViewer - MT5 Portfolio Manager")
        self.setMinimumSize(1600, 1000)
        
        # Widget central con scroll
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # Layout principal
        main_layout = QVBoxLayout(central_widget)
        main_layout.setSpacing(0)
        main_layout.setContentsMargins(0, 0, 0, 0)
        
        # Header moderno con gradiente
        self.create_modern_header(main_layout)
        
        # Área de métricas principales
        self.create_metrics_dashboard(main_layout)
        
        # Barra de herramientas moderna
        self.create_modern_toolbar(main_layout)
        
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
        
        # Barra de estado moderna
        self.status_bar = QStatusBar()
        self.setStatusBar(self.status_bar)
        self.status_bar.showMessage("🟢 Sistema listo - Configuración cargada")
        
        # Aplicar tema moderno
        self.apply_modern_theme()
    
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
    
    def create_modern_header(self, main_layout):
        """Crea el header moderno con título y logo"""
        header_frame = QFrame()
        header_frame.setObjectName("toolbar")
        header_frame.setFixedHeight(80)
        
        header_layout = QHBoxLayout(header_frame)
        header_layout.setContentsMargins(20, 10, 20, 10)
        
        # Título principal con icono
        title_layout = QVBoxLayout()
        title_label = QLabel("🚀 TradingViewer")
        title_label.setObjectName("titleLabel")
        subtitle_label = QLabel("Gestor de Cuentas MetaTrader 5")
        subtitle_label.setStyleSheet("color: #a0aec0; font-size: 12px;")
        
        title_layout.addWidget(title_label)
        title_layout.addWidget(subtitle_label)
        title_layout.addStretch()
        
        header_layout.addLayout(title_layout)
        header_layout.addStretch()
        
        # Indicador de estado global
        self.global_status_label = QLabel("🔴 Desconectado")
        self.global_status_label.setObjectName("statusLabel")
        header_layout.addWidget(self.global_status_label)
        
        main_layout.addWidget(header_frame)
    
    def create_metrics_dashboard(self, main_layout):
        """Crea el dashboard de métricas principales"""
        metrics_frame = QFrame()
        metrics_layout = QHBoxLayout(metrics_frame)
        metrics_layout.setContentsMargins(20, 10, 20, 10)
        metrics_layout.setSpacing(15)
        
        # Métricas principales en cards
        self.total_balance_card = self.create_metric_card("💰 Balance Total", "$0.00", "#48bb78")
        self.total_equity_card = self.create_metric_card("📊 Equity Total", "$0.00", "#4299e1")
        self.total_profit_card = self.create_metric_card("📈 P&L Total", "$0.00", "#ed8936")
        self.active_accounts_card = self.create_metric_card("🔗 Cuentas Activas", "0/0", "#9f7aea")
        
        metrics_layout.addWidget(self.total_balance_card)
        metrics_layout.addWidget(self.total_equity_card)
        metrics_layout.addWidget(self.total_profit_card)
        metrics_layout.addWidget(self.active_accounts_card)
        
        main_layout.addWidget(metrics_frame)
    
    def create_metric_card(self, title, value, color):
        """Crea una tarjeta de métrica moderna"""
        card = QFrame()
        card.setStyleSheet(get_metric_card_style(color) if MODERN_STYLES_AVAILABLE else f"""
            QFrame {{
                background: qlineargradient(x1: 0, y1: 0, x2: 1, y2: 1,
                                            stop: 0 rgba(45, 55, 72, 0.95), 
                                            stop: 1 rgba(26, 32, 44, 0.95));
                border: 2px solid {color};
                border-radius: 12px;
                padding: 16px;
                margin: 8px;
            }}
        """)
        card.setFixedHeight(100)
        
        layout = QVBoxLayout(card)
        layout.setContentsMargins(15, 10, 15, 10)
        
        title_label = QLabel(title)
        title_label.setStyleSheet(f"color: {color}; font-size: 12px; font-weight: bold;")
        
        value_label = QLabel(value)
        value_label.setStyleSheet("color: white; font-size: 24px; font-weight: bold;")
        value_label.setObjectName("valueLabel")
        
        layout.addWidget(title_label)
        layout.addWidget(value_label)
        layout.addStretch()
        
        # Agregar efecto de sombra
        shadow = QGraphicsDropShadowEffect()
        shadow.setBlurRadius(15)
        shadow.setColor(QColor(0, 0, 0, 80))
        shadow.setOffset(0, 3)
        card.setGraphicsEffect(shadow)
        
        return card
    
    def create_modern_toolbar(self, main_layout):
        """Crea la barra de herramientas moderna"""
        toolbar_frame = QFrame()
        toolbar_layout = QHBoxLayout(toolbar_frame)
        toolbar_layout.setContentsMargins(20, 10, 20, 10)
        toolbar_layout.setSpacing(15)
        
        # Botones principales con iconos y estilos
        self.start_all_btn = QPushButton("▶ Iniciar Todo")
        self.start_all_btn.setObjectName("startButton")
        self.start_all_btn.clicked.connect(self.start_all_workers)
        
        self.stop_all_btn = QPushButton("⏹ Detener Todo")
        self.stop_all_btn.setObjectName("stopButton")
        self.stop_all_btn.clicked.connect(self.stop_all_workers)
        
        self.reload_config_btn = QPushButton("🔄 Recargar")
        self.reload_config_btn.setObjectName("reloadButton")
        self.reload_config_btn.clicked.connect(self.load_config)
        
        self.edit_config_btn = QPushButton("✏ Editar Config")
        self.edit_config_btn.clicked.connect(self.edit_config)
        
        self.cleanup_btn = QPushButton("🧹 Limpiar")
        self.cleanup_btn.setObjectName("cleanupButton")
        self.cleanup_btn.clicked.connect(self.cleanup_all_temp_dirs)
        
        # Agregar botones a la toolbar
        toolbar_layout.addWidget(self.start_all_btn)
        toolbar_layout.addWidget(self.stop_all_btn)
        toolbar_layout.addWidget(self.reload_config_btn)
        toolbar_layout.addWidget(self.edit_config_btn)
        toolbar_layout.addWidget(self.cleanup_btn)
        
        toolbar_layout.addStretch()
        
        # Indicador de cuentas activas
        self.accounts_status_label = QLabel("Cuentas: 0/0 activas")
        self.accounts_status_label.setObjectName("statusLabel")
        toolbar_layout.addWidget(self.accounts_status_label)
        
        main_layout.addWidget(toolbar_frame)
    
    def apply_modern_theme(self):
        """Aplica el tema moderno a la aplicación"""
        if MODERN_STYLES_AVAILABLE:
            apply_modern_dark_theme(self)
        else:
            # Fallback al estilo básico mejorado
            self.setStyleSheet("""
                QMainWindow {
                    background: qlineargradient(x1: 0, y1: 0, x2: 1, y2: 1,
                                                stop: 0 #1a1a2e, stop: 1 #16213e);
                    color: #ffffff;
                    font-family: 'Segoe UI', Arial, sans-serif;
                }
                QPushButton {
                    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                                stop: 0 #4299e1, stop: 1 #3182ce);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: bold;
                    min-width: 120px;
                }
                QPushButton:hover {
                    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                                stop: 0 #63b3ed, stop: 1 #4299e1);
                }
                QTabWidget::pane {
                    border: 1px solid #4a5568;
                    background: rgba(45, 55, 72, 0.95);
                    border-radius: 8px;
                }
                QTabBar::tab {
                    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                                stop: 0 #2d3748, stop: 1 #1a202c);
                    color: #a0aec0;
                    padding: 12px 20px;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                    min-width: 100px;
                }
                QTabBar::tab:selected {
                    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                                stop: 0 #4299e1, stop: 1 #3182ce);
                    color: white;
                    font-weight: bold;
                }
                QTableWidget {
                    background: rgba(26, 32, 44, 0.95);
                    alternate-background-color: rgba(45, 55, 72, 0.5);
                    gridline-color: #4a5568;
                    border: 1px solid #4a5568;
                    border-radius: 8px;
                }
                QTextEdit {
                    background: rgba(26, 32, 44, 0.95);
                    color: #e2e8f0;
                    border: 1px solid #4a5568;
                    border-radius: 8px;
                    padding: 10px;
                }
                QLabel#titleLabel {
                    font-size: 16px;
                    font-weight: bold;
                    color: #4299e1;
                    padding: 5px;
                }
                QLabel#statusLabel {
                    font-size: 12px;
                    font-weight: bold;
                    color: #4299e1;
                    padding: 5px 10px;
                    background: rgba(66, 153, 225, 0.1);
                    border-radius: 4px;
                }
                QPushButton#startButton {
                    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                                stop: 0 #48bb78, stop: 1 #38a169);
                }
                QPushButton#startButton:hover {
                    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                                stop: 0 #68d391, stop: 1 #48bb78);
                }
                QPushButton#stopButton {
                    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                                stop: 0 #f56565, stop: 1 #e53e3e);
                }
                QPushButton#stopButton:hover {
                    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                                stop: 0 #fc8181, stop: 1 #f56565);
                }
                QPushButton#reloadButton {
                    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                                stop: 0 #ed8936, stop: 1 #dd6b20);
                }
                QPushButton#reloadButton:hover {
                    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                                stop: 0 #fbb040, stop: 1 #ed8936);
                }
                QPushButton#cleanupButton {
                    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                                stop: 0 #9f7aea, stop: 1 #805ad5);
                }
                QPushButton#cleanupButton:hover {
                    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                                stop: 0 #b794f6, stop: 1 #9f7aea);
                }
            """)
    
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
        """Actualiza la interfaz de usuario moderna"""
        self.update_accounts_table()
        self.update_positions_table()
        self.update_temp_dirs_tree()
        
        # Calcular totales para las métricas
        total_balance = 0
        total_equity = 0
        total_profit = 0
        running_count = 0
        total_count = len(self.workers)
        
        for worker in self.workers.values():
            if worker.is_running():
                running_count += 1
            
            data = worker.get_data_from_db()
            account_info = data.get('account_info', {})
            total_balance += account_info.get('balance', 0)
            total_equity += account_info.get('equity', 0)
            total_profit += account_info.get('profit', 0)
        
        # Actualizar las tarjetas de métricas
        self.update_metric_card(self.total_balance_card, f"${total_balance:,.2f}")
        self.update_metric_card(self.total_equity_card, f"${total_equity:,.2f}")
        
        # Color del profit según sea positivo o negativo
        profit_color = "#48bb78" if total_profit >= 0 else "#f56565"
        self.update_metric_card(self.total_profit_card, f"${total_profit:,.2f}", profit_color)
        self.update_metric_card(self.active_accounts_card, f"{running_count}/{total_count}")
        
        # Actualizar contador de cuentas activas en toolbar
        self.accounts_status_label.setText(f"Cuentas: {running_count}/{total_count} activas")
        
        # Actualizar estado global
        if running_count > 0:
            self.global_status_label.setText(f"🟢 {running_count} Cuenta(s) Conectada(s)")
            self.global_status_label.setObjectName("connectedStatus")
        else:
            self.global_status_label.setText("🔴 Desconectado")
            self.global_status_label.setObjectName("disconnectedStatus")
        
        # Reaplizar estilos al label de estado
        self.global_status_label.style().unpolish(self.global_status_label)
        self.global_status_label.style().polish(self.global_status_label)
        
        # Actualizar barra de estado
        temp_dirs_count = sum(1 for w in self.workers.values() if w.temp_dir)
        status_message = f"🟢 Sistema activo | Cuentas: {running_count}/{total_count} | Directorios: {temp_dirs_count}"
        if total_profit != 0:
            status_message += f" | P&L: ${total_profit:,.2f}"
        
        self.status_bar.showMessage(status_message)
    
    def update_metric_card(self, card, value, color=None):
        """Actualiza el valor de una tarjeta de métrica"""
        # Encontrar el label del valor en la tarjeta
        for child in card.findChildren(QLabel):
            if child.objectName() == "valueLabel":
                child.setText(value)
                if color:
                    # Actualizar el color del borde de la tarjeta si se proporciona
                    current_style = card.styleSheet()
                    # Reemplazar el color del borde
                    import re
                    new_style = re.sub(r'border: 2px solid [^;]+;', f'border: 2px solid {color};', current_style)
                    card.setStyleSheet(new_style)
                break
    
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