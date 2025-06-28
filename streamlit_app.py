#!/usr/bin/env python3
"""
TradingViewer - Streamlit Web App
Versión web moderna del gestor de cuentas MT5
"""

import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import json
import os
import sys
import sqlite3
import subprocess
import time
from datetime import datetime, timedelta
from typing import Dict, List, Any
import psutil
import tempfile
import shutil

# Configuración de la página
st.set_page_config(
    page_title="🚀 TradingViewer",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        'Get Help': 'https://github.com/tu-repo',
        'Report a bug': 'https://github.com/tu-repo/issues',
        'About': "# TradingViewer\n### Gestor Moderno de Cuentas MT5"
    }
)

# CSS personalizado para tema moderno
def load_custom_css():
    st.markdown("""
    <style>
    /* Tema principal */
    .main {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        color: #ffffff;
    }
    
    /* Header personalizado */
    .header-container {
        background: linear-gradient(90deg, #2d3748 0%, #1a202c 100%);
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 20px;
        border: 2px solid #4299e1;
        box-shadow: 0 4px 15px rgba(66, 153, 225, 0.3);
    }
    
    .header-title {
        font-size: 2.5rem;
        font-weight: bold;
        color: #4299e1;
        text-align: center;
        margin: 0;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .header-subtitle {
        font-size: 1.2rem;
        color: #a0aec0;
        text-align: center;
        margin-top: 5px;
    }
    
    /* Tarjetas de métricas */
    .metric-card {
        background: linear-gradient(135deg, rgba(45, 55, 72, 0.95) 0%, rgba(26, 32, 44, 0.95) 100%);
        padding: 20px;
        border-radius: 12px;
        border: 2px solid;
        margin: 10px 0;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease;
    }
    
    .metric-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }
    
    .metric-card.balance {
        border-color: #48bb78;
        background: linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(45, 55, 72, 0.95) 100%);
    }
    
    .metric-card.equity {
        border-color: #4299e1;
        background: linear-gradient(135deg, rgba(66, 153, 225, 0.1) 0%, rgba(45, 55, 72, 0.95) 100%);
    }
    
    .metric-card.profit {
        border-color: #ed8936;
        background: linear-gradient(135deg, rgba(237, 137, 54, 0.1) 0%, rgba(45, 55, 72, 0.95) 100%);
    }
    
    .metric-card.accounts {
        border-color: #9f7aea;
        background: linear-gradient(135deg, rgba(159, 122, 234, 0.1) 0%, rgba(45, 55, 72, 0.95) 100%);
    }
    
    .metric-title {
        font-size: 0.9rem;
        font-weight: bold;
        margin-bottom: 10px;
        opacity: 0.8;
    }
    
    .metric-value {
        font-size: 2rem;
        font-weight: bold;
        margin: 0;
    }
    
    /* Botones personalizados */
    .stButton > button {
        background: linear-gradient(45deg, #4299e1, #3182ce);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.5rem 1rem;
        font-weight: bold;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        background: linear-gradient(45deg, #63b3ed, #4299e1);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
    }
    
    /* Sidebar personalizada */
    .css-1d391kg {
        background: linear-gradient(180deg, #2d3748 0%, #1a202c 100%);
    }
    
    /* Tablas */
    .dataframe {
        background: rgba(26, 32, 44, 0.95);
        border-radius: 8px;
        overflow: hidden;
    }
    
    /* Status indicators */
    .status-connected {
        color: #48bb78;
        font-weight: bold;
    }
    
    .status-disconnected {
        color: #f56565;
        font-weight: bold;
    }
    
    .status-starting {
        color: #ed8936;
        font-weight: bold;
    }
    
    /* Alertas personalizadas */
    .stAlert {
        background: rgba(45, 55, 72, 0.95);
        border-radius: 8px;
        border-left: 4px solid #4299e1;
    }
    
    /* Ocultar elementos de Streamlit */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    .stDeployButton {display:none;}
    </style>
    """, unsafe_allow_html=True)

# Importar WorkerProcess del launcher original
sys.path.append(os.path.dirname(__file__))
try:
    from launcher import WorkerProcess
except ImportError:
    st.error("❌ No se pudo importar WorkerProcess. Asegúrate de que launcher.py esté en el mismo directorio.")
    st.stop()

class StreamlitTradingViewer:
    """Clase principal para la aplicación Streamlit"""
    
    def __init__(self):
        self.config_file = "config.json"
        self.workers: Dict[int, WorkerProcess] = {}
        
        # Inicializar session state
        if 'workers' not in st.session_state:
            st.session_state.workers = {}
        if 'last_update' not in st.session_state:
            st.session_state.last_update = datetime.now()
        if 'auto_refresh' not in st.session_state:
            st.session_state.auto_refresh = True
    
    def load_config(self):
        """Carga la configuración desde config.json"""
        try:
            if not os.path.exists(self.config_file):
                return []
            
            with open(self.config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            # Actualizar workers
            new_workers = {}
            for account_config in config:
                if not account_config.get('enabled', True):
                    continue
                    
                login = account_config['login']
                if login in st.session_state.workers:
                    # Actualizar configuración existente
                    st.session_state.workers[login].config = account_config
                    new_workers[login] = st.session_state.workers[login]
                else:
                    # Crear nuevo worker
                    new_workers[login] = WorkerProcess(account_config)
            
            st.session_state.workers = new_workers
            return config
            
        except Exception as e:
            st.error(f"❌ Error cargando configuración: {e}")
            return []
    
    def get_metrics_data(self):
        """Obtiene los datos de métricas de todos los workers"""
        total_balance = 0
        total_equity = 0
        total_profit = 0
        running_count = 0
        total_count = len(st.session_state.workers)
        
        for worker in st.session_state.workers.values():
            if worker.is_running():
                running_count += 1
            
            data = worker.get_data_from_db()
            account_info = data.get('account_info', {})
            total_balance += account_info.get('balance', 0)
            total_equity += account_info.get('equity', 0)
            total_profit += account_info.get('profit', 0)
        
        return {
            'total_balance': total_balance,
            'total_equity': total_equity,
            'total_profit': total_profit,
            'running_count': running_count,
            'total_count': total_count
        }
    
    def render_header(self):
        """Renderiza el header moderno"""
        st.markdown("""
        <div class="header-container">
            <h1 class="header-title">🚀 TradingViewer</h1>
            <p class="header-subtitle">Gestor Moderno de Cuentas MetaTrader 5</p>
        </div>
        """, unsafe_allow_html=True)
    
    def render_metrics_dashboard(self):
        """Renderiza el dashboard de métricas"""
        metrics = self.get_metrics_data()
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.markdown(f"""
            <div class="metric-card balance">
                <div class="metric-title">💰 Balance Total</div>
                <div class="metric-value">${metrics['total_balance']:,.2f}</div>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown(f"""
            <div class="metric-card equity">
                <div class="metric-title">📊 Equity Total</div>
                <div class="metric-value">${metrics['total_equity']:,.2f}</div>
            </div>
            """, unsafe_allow_html=True)
        
        with col3:
            profit_color = "profit" if metrics['total_profit'] >= 0 else "profit"
            profit_sign = "+" if metrics['total_profit'] >= 0 else ""
            st.markdown(f"""
            <div class="metric-card {profit_color}">
                <div class="metric-title">📈 P&L Total</div>
                <div class="metric-value" style="color: {'#48bb78' if metrics['total_profit'] >= 0 else '#f56565'}">
                    {profit_sign}${metrics['total_profit']:,.2f}
                </div>
            </div>
            """, unsafe_allow_html=True)
        
        with col4:
            st.markdown(f"""
            <div class="metric-card accounts">
                <div class="metric-title">🔗 Cuentas Activas</div>
                <div class="metric-value">{metrics['running_count']}/{metrics['total_count']}</div>
            </div>
            """, unsafe_allow_html=True)
    
    def render_control_panel(self):
        """Renderiza el panel de control"""
        st.markdown("### 🎯 Panel de Control")
        
        col1, col2, col3, col4, col5 = st.columns(5)
        
        with col1:
            if st.button("▶ Iniciar Todo", key="start_all", help="Iniciar todos los workers"):
                self.start_all_workers()
        
        with col2:
            if st.button("⏹ Detener Todo", key="stop_all", help="Detener todos los workers"):
                self.stop_all_workers()
        
        with col3:
            if st.button("🔄 Recargar Config", key="reload_config", help="Recargar configuración"):
                self.load_config()
                st.success("✅ Configuración recargada")
        
        with col4:
            if st.button("🧹 Limpiar Temporales", key="cleanup", help="Limpiar directorios temporales"):
                self.cleanup_temp_dirs()
        
        with col5:
            st.session_state.auto_refresh = st.checkbox("🔄 Auto-refresh", value=st.session_state.auto_refresh)
    
    def render_accounts_table(self):
        """Renderiza la tabla de cuentas"""
        st.markdown("### 💼 Cuentas")
        
        if not st.session_state.workers:
            st.info("📝 No hay cuentas configuradas. Edita config.json para agregar cuentas.")
            return
        
        accounts_data = []
        for login, worker in st.session_state.workers.items():
            config = worker.config
            data = worker.get_data_from_db()
            account_info = data.get('account_info', {})
            
            status = worker.status
            status_icon = "🟢" if status == "Connected" or status == "Running" else "🔴" if "Error" in status else "🟡"
            
            accounts_data.append({
                'Nombre': config.get('name', f"Cuenta {login}"),
                'Login': login,
                'Servidor': config['server'],
                'Estado': f"{status_icon} {status}",
                'Balance': f"${account_info.get('balance', 0):,.2f}",
                'Equity': f"${account_info.get('equity', 0):,.2f}",
                'Profit': f"${account_info.get('profit', 0):,.2f}",
                'Posiciones': len(data.get('positions', [])),
                'Directorio': worker.temp_dir or "No creado"
            })
        
        df = pd.DataFrame(accounts_data)
        st.dataframe(df, use_container_width=True)
        
        # Controles individuales
        st.markdown("#### 🎮 Controles Individuales")
        selected_account = st.selectbox(
            "Seleccionar cuenta:",
            options=list(st.session_state.workers.keys()),
            format_func=lambda x: f"{st.session_state.workers[x].config.get('name', f'Cuenta {x}')} ({x})"
        )
        
        if selected_account:
            col1, col2 = st.columns(2)
            worker = st.session_state.workers[selected_account]
            
            with col1:
                if st.button(f"▶ Iniciar {selected_account}", disabled=worker.is_running()):
                    self.start_worker(selected_account)
            
            with col2:
                if st.button(f"⏹ Detener {selected_account}", disabled=not worker.is_running()):
                    self.stop_worker(selected_account)
    
    def render_positions_table(self):
        """Renderiza la tabla de posiciones"""
        st.markdown("### 📊 Posiciones Abiertas")
        
        all_positions = []
        for login, worker in st.session_state.workers.items():
            data = worker.get_data_from_db()
            positions = data.get('positions', [])
            
            for pos in positions:
                all_positions.append({
                    'Cuenta': worker.config.get('name', f"Cuenta {login}"),
                    'Ticket': pos['ticket'],
                    'Símbolo': pos['symbol'],
                    'Tipo': 'BUY' if pos['type'] == 0 else 'SELL',
                    'Volumen': pos['volume'],
                    'Precio Apertura': f"{pos['price_open']:.5f}",
                    'Precio Actual': f"{pos['price_current']:.5f}",
                    'Profit': f"${pos['profit']:.2f}",
                    'Tiempo': datetime.fromtimestamp(pos['time']).strftime("%Y-%m-%d %H:%M:%S")
                })
        
        if all_positions:
            df = pd.DataFrame(all_positions)
            st.dataframe(df, use_container_width=True)
            
            # Gráfico de profit por cuenta
            if len(all_positions) > 0:
                st.markdown("#### 📈 Profit por Cuenta")
                profit_by_account = {}
                for pos in all_positions:
                    account = pos['Cuenta']
                    profit = float(pos['Profit'].replace('$', ''))
                    profit_by_account[account] = profit_by_account.get(account, 0) + profit
                
                fig = px.bar(
                    x=list(profit_by_account.keys()),
                    y=list(profit_by_account.values()),
                    color=list(profit_by_account.values()),
                    color_continuous_scale=['red', 'yellow', 'green'],
                    title="Profit/Loss por Cuenta"
                )
                fig.update_layout(
                    plot_bgcolor='rgba(0,0,0,0)',
                    paper_bgcolor='rgba(0,0,0,0)',
                    font_color='white'
                )
                st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("📊 No hay posiciones abiertas en este momento.")
    
    def render_temp_dirs_info(self):
        """Renderiza información de directorios temporales"""
        st.markdown("### 📁 Directorios Temporales")
        
        temp_dirs_data = []
        for login, worker in st.session_state.workers.items():
            if worker.temp_dir and os.path.exists(worker.temp_dir):
                # Calcular tamaño del directorio
                total_size = 0
                try:
                    for dirpath, dirnames, filenames in os.walk(worker.temp_dir):
                        for filename in filenames:
                            filepath = os.path.join(dirpath, filename)
                            try:
                                total_size += os.path.getsize(filepath)
                            except:
                                pass
                except:
                    pass
                
                size_mb = total_size / 1024 / 1024
                status = "🟢 Activo" if worker.is_running() else "🔴 Inactivo"
                
                temp_dirs_data.append({
                    'Cuenta': worker.config.get('name', f"Cuenta {login}"),
                    'Directorio': worker.temp_dir,
                    'Tamaño (MB)': f"{size_mb:.1f}",
                    'Estado': status
                })
        
        if temp_dirs_data:
            df = pd.DataFrame(temp_dirs_data)
            st.dataframe(df, use_container_width=True)
        else:
            st.info("📁 No hay directorios temporales creados.")
    
    def render_logs(self):
        """Renderiza los logs del sistema"""
        st.markdown("### 📋 Logs del Sistema")
        
        # Crear un área de logs simple
        if 'logs' not in st.session_state:
            st.session_state.logs = []
        
        # Mostrar logs
        logs_container = st.container()
        with logs_container:
            if st.session_state.logs:
                for log in st.session_state.logs[-50:]:  # Mostrar últimos 50 logs
                    st.text(log)
            else:
                st.info("📝 No hay logs disponibles.")
        
        # Botón para limpiar logs
        if st.button("🗑 Limpiar Logs"):
            st.session_state.logs = []
            st.success("✅ Logs limpiados")
    
    def add_log(self, message: str):
        """Agrega un mensaje al log"""
        if 'logs' not in st.session_state:
            st.session_state.logs = []
        
        timestamp = datetime.now().strftime("%H:%M:%S")
        formatted_message = f"[{timestamp}] {message}"
        st.session_state.logs.append(formatted_message)
        
        # Mantener solo los últimos 100 logs
        if len(st.session_state.logs) > 100:
            st.session_state.logs = st.session_state.logs[-100:]
    
    def start_worker(self, login: int):
        """Inicia un worker específico"""
        if login not in st.session_state.workers:
            return
        
        worker = st.session_state.workers[login]
        worker_script = os.path.join(os.path.dirname(__file__), "worker.py")
        
        if worker.start(worker_script):
            self.add_log(f"🟢 Iniciando worker para cuenta {login}")
            st.success(f"✅ Worker iniciado para cuenta {login}")
        else:
            self.add_log(f"❌ Error iniciando worker para cuenta {login}")
            st.error(f"❌ Error iniciando worker para cuenta {login}")
    
    def stop_worker(self, login: int):
        """Detiene un worker específico"""
        if login not in st.session_state.workers:
            return
        
        worker = st.session_state.workers[login]
        if worker.stop():
            self.add_log(f"🔴 Worker detenido para cuenta {login}")
            st.success(f"✅ Worker detenido para cuenta {login}")
        else:
            self.add_log(f"❌ Error deteniendo worker para cuenta {login}")
            st.error(f"❌ Error deteniendo worker para cuenta {login}")
    
    def start_all_workers(self):
        """Inicia todos los workers"""
        count = 0
        for login in st.session_state.workers:
            if not st.session_state.workers[login].is_running():
                self.start_worker(login)
                count += 1
        
        if count > 0:
            st.success(f"✅ {count} workers iniciados")
        else:
            st.info("ℹ️ Todos los workers ya están ejecutándose")
    
    def stop_all_workers(self):
        """Detiene todos los workers"""
        count = 0
        for login in st.session_state.workers:
            if st.session_state.workers[login].is_running():
                self.stop_worker(login)
                count += 1
        
        if count > 0:
            st.success(f"✅ {count} workers detenidos")
        else:
            st.info("ℹ️ No hay workers ejecutándose")
    
    def cleanup_temp_dirs(self):
        """Limpia todos los directorios temporales"""
        count = 0
        for worker in st.session_state.workers.values():
            if worker.temp_dir:
                worker.cleanup_temp_directory()
                count += 1
        
        self.add_log(f"🧹 Limpiados {count} directorios temporales")
        st.success(f"✅ {count} directorios temporales limpiados")
    
    def run(self):
        """Ejecuta la aplicación principal"""
        # Cargar CSS personalizado
        load_custom_css()
        
        # Cargar configuración
        self.load_config()
        
        # Renderizar header
        self.render_header()
        
        # Renderizar dashboard de métricas
        self.render_metrics_dashboard()
        
        # Renderizar panel de control
        self.render_control_panel()
        
        # Sidebar con navegación
        st.sidebar.markdown("## 🧭 Navegación")
        
        page = st.sidebar.selectbox(
            "Seleccionar página:",
            ["💼 Cuentas", "📊 Posiciones", "📁 Directorios", "📋 Logs", "⚙️ Configuración"]
        )
        
        # Auto-refresh
        if st.session_state.auto_refresh:
            st.sidebar.markdown("### 🔄 Auto-refresh")
            refresh_interval = st.sidebar.slider("Intervalo (segundos)", 5, 60, 10)
            
            # Placeholder para auto-refresh
            placeholder = st.empty()
            
            # Auto-refresh cada X segundos
            time.sleep(refresh_interval)
            st.experimental_rerun()
        
        # Renderizar página seleccionada
        if page == "💼 Cuentas":
            self.render_accounts_table()
        elif page == "📊 Posiciones":
            self.render_positions_table()
        elif page == "📁 Directorios":
            self.render_temp_dirs_info()
        elif page == "📋 Logs":
            self.render_logs()
        elif page == "⚙️ Configuración":
            self.render_config_editor()
        
        # Footer con información
        st.markdown("---")
        st.markdown("""
        <div style="text-align: center; opacity: 0.7; margin-top: 20px;">
            🚀 TradingViewer v2.0 - Streamlit Edition | 
            Última actualización: {} | 
            Workers activos: {}/{}
        </div>
        """.format(
            datetime.now().strftime("%H:%M:%S"),
            sum(1 for w in st.session_state.workers.values() if w.is_running()),
            len(st.session_state.workers)
        ), unsafe_allow_html=True)
    
    def render_config_editor(self):
        """Renderiza el editor de configuración"""
        st.markdown("### ⚙️ Configuración")
        
        st.info("💡 Edita el archivo config.json para agregar o modificar cuentas.")
        
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r', encoding='utf-8') as f:
                config_content = f.read()
            
            st.markdown("#### 📝 Contenido actual de config.json:")
            st.code(config_content, language='json')
            
            st.markdown("#### ✏️ Editor de configuración:")
            new_config = st.text_area(
                "Editar configuración:",
                value=config_content,
                height=400,
                help="Modifica la configuración JSON y presiona 'Guardar' para aplicar los cambios."
            )
            
            col1, col2 = st.columns(2)
            with col1:
                if st.button("💾 Guardar Configuración"):
                    try:
                        # Validar JSON
                        json.loads(new_config)
                        
                        # Guardar archivo
                        with open(self.config_file, 'w', encoding='utf-8') as f:
                            f.write(new_config)
                        
                        st.success("✅ Configuración guardada exitosamente")
                        self.add_log("📝 Configuración actualizada")
                        
                        # Recargar configuración
                        self.load_config()
                        
                    except json.JSONDecodeError as e:
                        st.error(f"❌ Error en el formato JSON: {e}")
                    except Exception as e:
                        st.error(f"❌ Error guardando configuración: {e}")
            
            with col2:
                if st.button("🔄 Recargar desde archivo"):
                    self.load_config()
                    st.success("✅ Configuración recargada")
        else:
            st.warning("⚠️ Archivo config.json no encontrado")
            
            if st.button("📝 Crear config.json de ejemplo"):
                example_config = [
                    {
                        "name": "Cuenta Demo",
                        "login": 123456,
                        "password": "password",
                        "server": "MetaQuotes-Demo",
                        "terminal_path": "C:/Program Files/MetaTrader 5/terminal64.exe",
                        "enabled": True,
                        "update_interval": 5
                    }
                ]
                
                with open(self.config_file, 'w', encoding='utf-8') as f:
                    json.dump(example_config, f, indent=2, ensure_ascii=False)
                
                st.success("✅ Archivo config.json de ejemplo creado")
                st.experimental_rerun()

def main():
    """Función principal"""
    try:
        app = StreamlitTradingViewer()
        app.run()
    except Exception as e:
        st.error(f"❌ Error en la aplicación: {e}")
        st.exception(e)

if __name__ == "__main__":
    main() 