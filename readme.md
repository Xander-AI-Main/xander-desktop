# xander-desktop

> Electron + React desktop app for Xander — integrates a React front-end with local Python deep-learning scripts (located in `src/scripts`) for on-device model inference and training.

A clean, modular Electron app that serves a React UI and communicates with Python DL algorithms for heavy ML workloads. Ideal for prototyping ML-powered desktop tools that need a polished UI + local model execution.

---

## Table of contents

- [Project overview](#project-overview)  
- [Key features](#key-features)  
- [Requirements](#requirements)  
- [Setup & development](#setup--development) 

---

## Project overview

`xander-desktop` is an Electron application that uses a React frontend for UI and a set of Python deep-learning scripts (in `src/scripts`) for model training/inference. Electron runs the React bundle in the renderer process and uses the main process to coordinate native capabilities and Python execution. This approach keeps the UI responsive while delegating compute-heavy ML work to Python.

---

## Key features

- Modern React-based UI  
- Electron main process orchestrates window lifecycle and native integrations  
- Local Python scripts for deep learning in `src/scripts` (training, inference, preprocessing)  
- IPC channels (`ipcMain` / `ipcRenderer`) to trigger Python tasks and stream results  
- Utilities to spawn Python processes and capture STDOUT/STDERR  
- Cross-platform packaging (Windows/macOS/Linux)

---

## Requirements

- Node.js (>= 18 recommended) and npm / yarn  
- Python (3.8+)  
- Virtual environment recommended (venv or conda)  
- Python DL packages (torch, tensorflow, etc.) as required by `src/scripts`  
- `electron-builder` (for packaging installers)

---

## Setup & development

### 1. Clone the repo
```bash
git clone https://github.com/Xander-AI-Main/xander-desktop.git
cd xander-desktop

### 2. Install Node dependencies
npm install
