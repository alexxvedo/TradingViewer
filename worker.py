#!/usr/bin/env python3
"""
MT5 Worker - Maneja una cuenta individual de MetaTrader 5 en modo portable
Utiliza carpetas temporales independientes para cada instancia
"""

import argparse
import json
import time
import sys
import os
import sqlite3
import tempfile
import shutil
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from pathlib import Path
import MetaTrader5 as mt5


class MT5PortableWorker:
    def __init__(self, login: int, password: str, server: str, 
                 terminal_path: str, temp_dir: str, update_interval: int = 5):
        self.login = login
        self.password = password
        self.server = server
        self.terminal_path = terminal_path
        self.temp_dir = temp_dir
        self.update_interval = update_interval
        self.running = False
        self.connected = False
        self.db_path = os.path.join(temp_dir, f"mt5_data_{login}.db")
        
        # Asegurar que el directorio temporal existe
        os.makedirs(temp_dir, exist_ok=True)
        
        # Inicializar base de datos SQLite
        self.init_database()
        
    def init_database(self):
        """Inicializa la base de datos SQLite para almacenar datos"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Tabla para información de cuenta
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS account_info (
                    id INTEGER PRIMARY KEY,
                    login INTEGER,
                    server TEXT,
                    name TEXT,
                    company TEXT,
                    currency TEXT,
                    leverage INTEGER,
                    balance REAL,
                    equity REAL,
                    margin REAL,
                    margin_free REAL,
                    margin_level REAL,
                    profit REAL,
                    timestamp TEXT
                )
            ''')
            
            # Tabla para posiciones
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS positions (
                    ticket INTEGER PRIMARY KEY,
                    symbol TEXT,
                    type INTEGER,
                    volume REAL,
                    price_open REAL,
                    price_current REAL,
                    profit REAL,
                    swap REAL,
                    commission REAL,
                    time INTEGER,
                    comment TEXT,
                    timestamp TEXT
                )
            ''')
            
            # Tabla para deals/operaciones
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS deals (
                    ticket INTEGER PRIMARY KEY,
                    order_ticket INTEGER,
                    time INTEGER,
                    type INTEGER,
                    entry INTEGER,
                    symbol TEXT,
                    volume REAL,
                    price REAL,
                    commission REAL,
                    swap REAL,
                    profit REAL,
                    comment TEXT,
                    timestamp TEXT
                )
            ''')
            
            # Tabla para estado del worker
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS worker_status (
                    id INTEGER PRIMARY KEY,
                    login INTEGER,
                    status TEXT,
                    connected BOOLEAN,
                    last_update TEXT,
                    error_message TEXT
                )
            ''')
            
            conn.commit()
            conn.close()
            
            self.log_message("Base de datos inicializada correctamente")
            
        except Exception as e:
            self.log_message(f"Error inicializando base de datos: {e}")
    
    def log_message(self, message: str):
        """Registra un mensaje con timestamp"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] Worker {self.login}: {message}")
    
    def create_mt5_config(self) -> str:
        """Crea el archivo de configuración MT5 en el directorio temporal"""
        try:
            config_path = os.path.join(self.temp_dir, "metatrader.ini")
            
            # Configuración básica para modo portable
            config_content = f"""[Common]
Login={self.login}
Password={self.password}
Server={self.server}
ProxyEnable=0
ProxyType=0
ProxyAddress=
ProxyPort=8080
ProxyLogin=
ProxyPassword=
KeepPrivate=0
NewsEnable=1
EnableDDE=0
EnableAPI=1

[Charts]
ProfileLast=Default
MaxBars=65000

[Experts]
AllowLiveTrading=1
AllowDllImport=1
Confirm=1
Account={self.login}

[Objects]
BmpPath=
"""
            
            with open(config_path, 'w', encoding='utf-8') as f:
                f.write(config_content)
            
            self.log_message(f"Archivo de configuración creado: {config_path}")
            return config_path
            
        except Exception as e:
            self.log_message(f"Error creando configuración MT5: {e}")
            return ""
    
    def initialize_mt5(self) -> bool:
        """Inicializa la conexión con MT5 en modo portable"""
        try:
            # Crear configuración MT5
            config_path = self.create_mt5_config()
            if not config_path:
                return False
            
            # Inicializar MT5 en modo portable
            if not mt5.initialize(
                path=self.terminal_path,
                login=self.login,
                password=self.password,
                server=self.server,
                portable=True
            ):
                error_code = mt5.last_error()
                self.log_message(f"Error inicializando MT5: {error_code}")
                self.update_worker_status("Error", False, f"MT5 Error: {error_code}")
                return False
            
            # Verificar la conexión
            account_info = mt5.account_info()
            if account_info is None:
                self.log_message("Error: No se pudo obtener información de la cuenta")
                self.update_worker_status("Error", False, "No account info")
                return False
            
            self.connected = True
            self.log_message(f"Conectado exitosamente - Cuenta: {account_info.login}, Servidor: {account_info.server}")
            
            # Guardar información inicial de la cuenta
            self.save_account_info(account_info)
            self.update_worker_status("Connected", True, "")
            
            return True
            
        except Exception as e:
            self.log_message(f"Error en initialize_mt5: {e}")
            self.update_worker_status("Error", False, str(e))
            return False
    
    def save_account_info(self, account_info):
        """Guarda la información de la cuenta en la base de datos"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT OR REPLACE INTO account_info 
                (id, login, server, name, company, currency, leverage, balance, 
                 equity, margin, margin_free, margin_level, profit, timestamp)
                VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                account_info.login,
                account_info.server,
                account_info.name,
                account_info.company,
                account_info.currency,
                account_info.leverage,
                account_info.balance,
                account_info.equity,
                account_info.margin,
                account_info.margin_free,
                account_info.margin_level,
                account_info.profit,
                datetime.now().isoformat()
            ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            self.log_message(f"Error guardando información de cuenta: {e}")
    
    def save_positions(self, positions):
        """Guarda las posiciones en la base de datos"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Limpiar posiciones anteriores
            cursor.execute('DELETE FROM positions')
            
            # Insertar posiciones actuales
            for pos in positions:
                cursor.execute('''
                    INSERT INTO positions 
                    (ticket, symbol, type, volume, price_open, price_current, 
                     profit, swap, commission, time, comment, timestamp)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    pos.ticket,
                    pos.symbol,
                    pos.type,
                    pos.volume,
                    pos.price_open,
                    pos.price_current,
                    pos.profit,
                    pos.swap,
                    pos.commission,
                    pos.time,
                    pos.comment,
                    datetime.now().isoformat()
                ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            self.log_message(f"Error guardando posiciones: {e}")
    
    def save_deals(self, deals):
        """Guarda las operaciones en la base de datos"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            for deal in deals:
                cursor.execute('''
                    INSERT OR REPLACE INTO deals 
                    (ticket, order_ticket, time, type, entry, symbol, volume, 
                     price, commission, swap, profit, comment, timestamp)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    deal.ticket,
                    deal.order,
                    deal.time,
                    deal.type,
                    deal.entry,
                    deal.symbol,
                    deal.volume,
                    deal.price,
                    deal.commission,
                    deal.swap,
                    deal.profit,
                    deal.comment,
                    datetime.now().isoformat()
                ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            self.log_message(f"Error guardando deals: {e}")
    
    def update_worker_status(self, status: str, connected: bool, error_message: str = ""):
        """Actualiza el estado del worker en la base de datos"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT OR REPLACE INTO worker_status 
                (id, login, status, connected, last_update, error_message)
                VALUES (1, ?, ?, ?, ?, ?)
            ''', (
                self.login,
                status,
                connected,
                datetime.now().isoformat(),
                error_message
            ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            self.log_message(f"Error actualizando estado: {e}")
    
    def get_positions(self) -> List:
        """Obtiene las posiciones abiertas"""
        try:
            positions = mt5.positions_get()
            return positions if positions is not None else []
        except Exception as e:
            self.log_message(f"Error obteniendo posiciones: {e}")
            return []
    
    def get_recent_deals(self, hours_back: int = 24) -> List:
        """Obtiene las operaciones recientes"""
        try:
            date_from = datetime.now() - timedelta(hours=hours_back)
            date_to = datetime.now()
            
            deals = mt5.history_deals_get(date_from, date_to)
            return deals if deals is not None else []
        except Exception as e:
            self.log_message(f"Error obteniendo deals: {e}")
            return []
    
    def run_monitoring_loop(self):
        """Bucle principal de monitoreo"""
        self.log_message("Iniciando bucle de monitoreo")
        
        while self.running:
            try:
                if not self.connected:
                    self.log_message("Intentando reconectar...")
                    if not self.initialize_mt5():
                        time.sleep(10)  # Esperar antes de reintentar
                        continue
                
                # Obtener y guardar información de cuenta
                account_info = mt5.account_info()
                if account_info:
                    self.save_account_info(account_info)
                
                # Obtener y guardar posiciones
                positions = self.get_positions()
                if positions:
                    self.save_positions(positions)
                    self.log_message(f"Posiciones actualizadas: {len(positions)}")
                
                # Obtener y guardar deals recientes
                recent_deals = self.get_recent_deals(1)  # Última hora
                if recent_deals:
                    self.save_deals(recent_deals)
                    self.log_message(f"Deals actualizados: {len(recent_deals)}")
                
                # Actualizar estado
                self.update_worker_status("Running", True, "")
                
                # Esperar antes del siguiente ciclo
                time.sleep(self.update_interval)
                
            except KeyboardInterrupt:
                self.log_message("Interrumpido por el usuario")
                break
            except Exception as e:
                self.log_message(f"Error en el bucle de monitoreo: {e}")
                self.connected = False
                self.update_worker_status("Error", False, str(e))
                time.sleep(5)  # Esperar antes de reintentar
    
    def start(self):
        """Inicia el worker"""
        self.log_message(f"Iniciando worker para cuenta {self.login}")
        self.log_message(f"Directorio temporal: {self.temp_dir}")
        
        # Inicializar MT5
        if not self.initialize_mt5():
            self.log_message("Error: No se pudo inicializar MT5")
            return False
        
        self.running = True
        
        try:
            self.run_monitoring_loop()
        finally:
            self.stop()
        
        return True
    
    def stop(self):
        """Detiene el worker y limpia recursos"""
        self.log_message("Deteniendo worker")
        self.running = False
        self.connected = False
        
        # Actualizar estado final
        self.update_worker_status("Stopped", False, "")
        
        # Cerrar conexión MT5
        try:
            mt5.shutdown()
            self.log_message("Conexión MT5 cerrada")
        except Exception as e:
            self.log_message(f"Error cerrando MT5: {e}")


def main():
    """Función principal del worker"""
    parser = argparse.ArgumentParser(description='MT5 Portable Worker')
    parser.add_argument('--login', type=int, required=True, help='Login de la cuenta MT5')
    parser.add_argument('--password', type=str, required=True, help='Password de la cuenta')
    parser.add_argument('--server', type=str, required=True, help='Servidor MT5')
    parser.add_argument('--terminal_path', type=str, required=True, help='Ruta al terminal MT5')
    parser.add_argument('--temp_dir', type=str, required=True, help='Directorio temporal')
    parser.add_argument('--update_interval', type=int, default=5, help='Intervalo de actualización en segundos')
    
    args = parser.parse_args()
    
    # Crear y ejecutar el worker
    worker = MT5PortableWorker(
        login=args.login,
        password=args.password,
        server=args.server,
        terminal_path=args.terminal_path,
        temp_dir=args.temp_dir,
        update_interval=args.update_interval
    )
    
    try:
        worker.start()
    except KeyboardInterrupt:
        print("\nDeteniendo worker...")
        worker.stop()
    except Exception as e:
        print(f"Error fatal: {e}")
        worker.stop()
        sys.exit(1)


if __name__ == "__main__":
    main() 