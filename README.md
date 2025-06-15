# 📈 Optivest – Simulador de Estratégias de Investimentos para o StockMarket Português

A **Optivest** é uma plataforma web moderna que permite simular estratégias de investimento com dados reais do mercado. É focada em educação financeira, análise de desempenho e acompanhamento visual de portefólio — tudo com um design elegante e profissional ao estilo das melhores plataformas fintech.

---

## 🔍 Visão Geral

- 🧠 Simulação de estratégias de investimento (DCA, Lump Sum, Reinvest Dividends)
- 📊 Visualização de resultados com gráficos
- 💼 Gestão de portefólio fictício
- ⭐ Watchlist de ações favoritas
- 📈 Dados de mercado via API Yahoo Finance
- 🔐 Registo, login e upload de imagem de perfil
- 🎥 Página principal com vídeo, secções de funcionalidades, arquitetura, FAQ, e Footer
- 🌙 Design escuro e responsivo com UI refinado.

---

## 🛠️ Tecnologias Utilizadas

### 🧩 Frontend

- React.js
- React Router DOM
- Axios
- Recharts & ApexCharts
- tsparticles (animações visuais)
- CSS personalizado com estética moderna

### 🔙 Backend

- Python 3
- Django
- Django REST Framework
- SQLite (ambiente local)
- Pillow (upload de imagem de perfil)
- django-cors-headers

### 📡 APIs

- [Yahoo Finance API](https://www.yahoofinanceapi.com/) para dados do mercado em tempo real

---

## 🧪 Funcionalidades Principais

| Funcionalidade                  | Descrição |
|--------------------------------|-----------|
| 🔐 Autenticação JWT            | Registo, login, logout seguro, com proteção de rotas |
| 👤 Gestão de Perfil            | Upload de imagem, dados pessoais |
| 📈 Simulador de Investimentos  | Estratégias DCA, Lump Sum, DCA + DIV com parâmetros customizáveis |
| 📊 Resultados Visuais          | Gráficos interativos de desempenho |
| ⭐ Favoritos (Watchlist)       | Marcar ações e ver numa secção especial |
| 💡 Landing Page informativa   | Vídeo, arquitetura, FAQ e funcionalidades destacadas |

---

## ⚙️ Como correr o projeto localmente:

### 🔹 1. Clonar o repositório

git clone https://github.com/RodolfoMoreiraa/Optivest.git

cd Optivest

### 🔹 2. Backend (Django)

cd optivest_backend

python -m venv venv

venv\Scripts\activate se utilizar Windows

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver

### 🔹 3. Frontend (React)

cd ../optivest-frontend

npm install

npm start

## 📸 Exemplos Visuais

### 💻 Dashboard

![Dashboard da Optivest](./assets/optifront.png)

### 📊 Simulador de Investimentos

![Simulador](./assets/postsimulation.png)



