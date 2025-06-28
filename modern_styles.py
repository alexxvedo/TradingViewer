#!/usr/bin/env python3
"""
Modern Styles - Estilos modernos para TradingViewer
Incluye temas oscuros, gradientes, animaciones y efectos visuales
"""

# Tema principal moderno y oscuro
MODERN_DARK_THEME = """
/* Configuración global */
QMainWindow {
    background: qlineargradient(x1: 0, y1: 0, x2: 1, y2: 1,
                                stop: 0 #1a1a2e, stop: 1 #16213e);
    color: #ffffff;
    font-family: 'Segoe UI', 'Arial', sans-serif;
}

/* Barra de herramientas principal */
QWidget#toolbar {
    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                stop: 0 #2d3748, stop: 1 #1a202c);
    border-bottom: 2px solid #4299e1;
    padding: 10px;
    border-radius: 8px;
    margin: 5px;
}

/* Botones principales */
QPushButton {
    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                stop: 0 #4299e1, stop: 1 #3182ce);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 11px;
    min-width: 120px;
    min-height: 16px;
}

QPushButton:hover {
    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                stop: 0 #63b3ed, stop: 1 #4299e1);
    transform: translateY(-1px);
}

QPushButton:pressed {
    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                stop: 0 #2c5282, stop: 1 #2a4365);
}

/* Botones de acción específicos */
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

/* Pestañas (Tabs) */
QTabWidget::pane {
    border: 1px solid #4a5568;
    background: rgba(45, 55, 72, 0.95);
    border-radius: 8px;
    margin-top: 5px;
}

QTabBar::tab {
    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                stop: 0 #2d3748, stop: 1 #1a202c);
    color: #a0aec0;
    padding: 12px 20px;
    margin-right: 2px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    min-width: 100px;
    font-weight: 500;
}

QTabBar::tab:selected {
    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                stop: 0 #4299e1, stop: 1 #3182ce);
    color: white;
    font-weight: bold;
}

QTabBar::tab:hover:!selected {
    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                stop: 0 #4a5568, stop: 1 #2d3748);
    color: #e2e8f0;
}

/* Tablas */
QTableWidget {
    background: rgba(26, 32, 44, 0.95);
    alternate-background-color: rgba(45, 55, 72, 0.5);
    gridline-color: #4a5568;
    border: 1px solid #4a5568;
    border-radius: 8px;
    selection-background-color: #4299e1;
}

QTableWidget::item {
    padding: 8px;
    border: none;
    color: #e2e8f0;
}

QTableWidget::item:selected {
    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                stop: 0 #4299e1, stop: 1 #3182ce);
    color: white;
}

QHeaderView::section {
    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                stop: 0 #2d3748, stop: 1 #1a202c);
    color: white;
    padding: 10px;
    border: 1px solid #4a5568;
    font-weight: bold;
    font-size: 11px;
}

QHeaderView::section:hover {
    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                stop: 0 #4a5568, stop: 1 #2d3748);
}

/* Área de texto / Logs */
QTextEdit {
    background: rgba(26, 32, 44, 0.95);
    color: #e2e8f0;
    border: 1px solid #4a5568;
    border-radius: 8px;
    padding: 10px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 10px;
    line-height: 1.4;
}

/* Etiquetas */
QLabel {
    color: #e2e8f0;
    font-weight: 500;
}

QLabel#titleLabel {
    font-size: 16px;
    font-weight: bold;
    color: #4299e1;
    padding: 5px;
}

QLabel#balanceLabel {
    font-size: 14px;
    font-weight: bold;
    color: #48bb78;
    padding: 8px 16px;
    background: rgba(72, 187, 120, 0.1);
    border-radius: 6px;
    border: 1px solid #48bb78;
}

QLabel#equityLabel {
    font-size: 14px;
    font-weight: bold;
    color: #4299e1;
    padding: 8px 16px;
    background: rgba(66, 153, 225, 0.1);
    border-radius: 6px;
    border: 1px solid #4299e1;
}

QLabel#profitLabel {
    font-size: 14px;
    font-weight: bold;
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid;
}

QLabel#statusLabel {
    font-size: 12px;
    font-weight: bold;
    color: #4299e1;
    padding: 5px 10px;
    background: rgba(66, 153, 225, 0.1);
    border-radius: 4px;
}

/* Árbol de directorios */
QTreeWidget {
    background: rgba(26, 32, 44, 0.95);
    color: #e2e8f0;
    border: 1px solid #4a5568;
    border-radius: 8px;
    alternate-background-color: rgba(45, 55, 72, 0.5);
}

QTreeWidget::item {
    padding: 6px;
    border: none;
}

QTreeWidget::item:selected {
    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                stop: 0 #4299e1, stop: 1 #3182ce);
    color: white;
}

QTreeWidget::item:hover {
    background: rgba(66, 153, 225, 0.2);
}

/* Barras de desplazamiento */
QScrollBar:vertical {
    background: #2d3748;
    width: 12px;
    border-radius: 6px;
}

QScrollBar::handle:vertical {
    background: #4a5568;
    border-radius: 6px;
    min-height: 20px;
}

QScrollBar::handle:vertical:hover {
    background: #718096;
}

QScrollBar:horizontal {
    background: #2d3748;
    height: 12px;
    border-radius: 6px;
}

QScrollBar::handle:horizontal {
    background: #4a5568;
    border-radius: 6px;
    min-width: 20px;
}

QScrollBar::handle:horizontal:hover {
    background: #718096;
}

/* Barra de estado */
QStatusBar {
    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                stop: 0 #2d3748, stop: 1 #1a202c);
    color: #a0aec0;
    border-top: 1px solid #4a5568;
    padding: 5px;
}

/* Grupos de widgets */
QGroupBox {
    font-weight: bold;
    color: #4299e1;
    border: 2px solid #4a5568;
    border-radius: 8px;
    margin-top: 10px;
    padding-top: 10px;
}

QGroupBox::title {
    subcontrol-origin: margin;
    left: 10px;
    padding: 0 8px 0 8px;
    background: #1a202c;
    color: #4299e1;
}

/* Indicadores de estado */
QLabel#connectedStatus {
    background: rgba(72, 187, 120, 0.2);
    color: #48bb78;
    border: 1px solid #48bb78;
    border-radius: 4px;
    padding: 4px 8px;
    font-weight: bold;
}

QLabel#disconnectedStatus {
    background: rgba(245, 101, 101, 0.2);
    color: #f56565;
    border: 1px solid #f56565;
    border-radius: 4px;
    padding: 4px 8px;
    font-weight: bold;
}

QLabel#startingStatus {
    background: rgba(237, 137, 54, 0.2);
    color: #ed8936;
    border: 1px solid #ed8936;
    border-radius: 4px;
    padding: 4px 8px;
    font-weight: bold;
}

/* Efectos de hover para botones pequeños */
QPushButton#smallButton {
    min-width: 30px;
    min-height: 30px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: bold;
}

/* Animaciones y transiciones (simuladas con hover) */
QPushButton, QTabBar::tab, QTableWidget::item {
    transition: all 0.3s ease;
}

/* Ventana principal con sombras */
QMainWindow::separator {
    background: #4a5568;
    width: 1px;
    height: 1px;
}

/* Splitter personalizado */
QSplitter::handle {
    background: #4a5568;
}

QSplitter::handle:horizontal {
    width: 2px;
}

QSplitter::handle:vertical {
    height: 2px;
}

QSplitter::handle:pressed {
    background: #4299e1;
}
"""

# Tema claro alternativo
MODERN_LIGHT_THEME = """
QMainWindow {
    background: qlineargradient(x1: 0, y1: 0, x2: 1, y2: 1,
                                stop: 0 #f7fafc, stop: 1 #edf2f7);
    color: #2d3748;
}

QPushButton {
    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                stop: 0 #4299e1, stop: 1 #3182ce);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: bold;
}

QPushButton:hover {
    background: qlineargradient(x1: 0, y1: 0, x2: 0, y2: 1,
                                stop: 0 #63b3ed, stop: 1 #4299e1);
}

QTabWidget::pane {
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 8px;
}

QTabBar::tab {
    background: #f7fafc;
    color: #4a5568;
    padding: 12px 20px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

QTabBar::tab:selected {
    background: #4299e1;
    color: white;
}

QTableWidget {
    background: white;
    alternate-background-color: #f7fafc;
    gridline-color: #e2e8f0;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
}

QTextEdit {
    background: white;
    color: #2d3748;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
}
"""

# Funciones para aplicar temas
def apply_modern_dark_theme(app):
    """Aplica el tema oscuro moderno"""
    app.setStyleSheet(MODERN_DARK_THEME)

def apply_modern_light_theme(app):
    """Aplica el tema claro moderno"""
    app.setStyleSheet(MODERN_LIGHT_THEME)

# Estilos específicos para componentes
def get_card_style():
    """Estilo para tarjetas/cards"""
    return """
    QWidget {
        background: rgba(45, 55, 72, 0.95);
        border: 1px solid #4a5568;
        border-radius: 12px;
        padding: 16px;
        margin: 8px;
    }
    """

def get_metric_card_style(color="#4299e1"):
    """Estilo para tarjetas de métricas"""
    return f"""
    QWidget {{
        background: qlineargradient(x1: 0, y1: 0, x2: 1, y2: 1,
                                    stop: 0 rgba(45, 55, 72, 0.95), 
                                    stop: 1 rgba(26, 32, 44, 0.95));
        border: 2px solid {color};
        border-radius: 12px;
        padding: 16px;
        margin: 8px;
    }}
    """

def get_glow_effect_style(color="#4299e1"):
    """Estilo con efecto de brillo"""
    return f"""
    QWidget {{
        border: 2px solid {color};
        border-radius: 8px;
        background: rgba(66, 153, 225, 0.1);
    }}
    """ 