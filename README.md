#  Golobe - Sistema de Reservas de Voos e Hotéis

Sistema web desenvolvido em **ASP.NET Core MVC** para gestão de reservas de voos e hospedagens, utilizando **Entity Framework Core** para persistência de dados e **Bootstrap 5** para interface responsiva.

##  Sobre o Projeto

O **Golobe** é uma aplicação de reservas de viagens que permite aos usuários:
- Pesquisar e reservar voos
- Pesquisar e reservar hotéis
- Gerenciar suas reservas e tickets
- Painel administrativo para gestão de voos e hotéis

##  Tecnologias Utilizadas

- **ASP.NET Core MVC** (.NET 8.0)
- **Entity Framework Core** (Code-First com Migrations)
- **MySQL** (Banco de dados)
- **Bootstrap 5.3.3** (Framework CSS)
- **Font Awesome 6** (Ícones)
- **BCrypt.Net** (Hash de senhas)
- **Cookie Authentication** (Autenticação e autorização)

##  Estrutura do Projeto

```
Projeto-Hotel-Aviao/
├── Controllers/           # Controladores MVC
│   ├── AccountController.cs    # Autenticação (Login, Signup, Logout)
│   ├── AdminController.cs      # Painel administrativo (CRUD)
│   ├── FlightsController.cs    # Gestão de voos
│   ├── HotelsController.cs     # Gestão de hotéis
│   └── HomeController.cs       # Página inicial
├── Models/                # Modelos de dados
│   ├── Flight.cs              # Modelo de voo
│   ├── Hotel.cs               # Modelo de hotel
│   ├── User.cs                # Modelo de usuário
│   ├── Booking.cs             # Reserva de voo
│   └── HotelBooking.cs        # Reserva de hotel
├── Views/                 # Views Razor
│   ├── Flights/               # Views de voos
│   ├── Hotels/                # Views de hotéis
│   ├── Account/               # Views de autenticação
│   ├── Admin/                 # Views do painel admin
│   └── Shared/                # Layout e componentes compartilhados
├── Data/                  # Contexto do banco de dados
│   ├── ApplicationDbContext.cs
│   └── DbInitializer.cs
├── Database/              # Scripts SQL
│   └── create_tables.sql      # Script de criação do banco
├── Migrations/            # Migrations do Entity Framework
└── wwwroot/               # Arquivos estáticos (CSS, JS, imagens)
```

##  Pré-requisitos

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (8.0 ou superior)
- IDE recomendada: [Visual Studio 2022](https://visualstudio.microsoft.com/) ou [VS Code](https://code.visualstudio.com/)

##  Como Executar

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd Projeto-Hotel-Aviao
```

### 2. Configure o banco de dados

**Opção A: Usando Migrations (recomendado)**
```bash
# Restaurar pacotes
dotnet restore

# Aplicar migrations
dotnet ef database update
```

**Opção B: Usando o script SQL**
1. Abra o MySQL Workbench ou outro cliente MySQL
2. Execute o script `Database/create_tables.sql`

### 3. Configure a conexão com o banco

Edite o arquivo `appsettings.json` com suas credenciais do MySQL:

```json
{
  "ConnectionStrings": {
    "DefaultDatabase": "server=localhost;database=Travel;user=seu_usuario;password=sua_senha"
  }
}
```

### 4. Execute a aplicação
```bash
dotnet run
```

A aplicação estará disponível em: `https://localhost:5001` ou `http://localhost:5000`

##  Credenciais de Acesso

### Administrador (criado automaticamente)
- **Email:** `admin@gmail.com`
- **Senha:** `admin123`

O administrador tem acesso ao painel de gestão onde pode:
- Adicionar, editar e excluir voos
- Adicionar, editar e excluir hotéis
- Visualizar todas as reservas

### Usuário Comum
Qualquer pessoa pode criar uma conta através da página de **Sign Up**.

## 🔐 Funcionalidades por Perfil

### Usuário Não Autenticado
- Visualizar listagem de voos
- Visualizar listagem de hotéis
- Visualizar detalhes de voos e hotéis
- Criar conta / fazer login

### Usuário Autenticado
- Todas as funcionalidades acima
- Realizar reservas de voos
- Realizar reservas de hotéis
- Visualizar e cancelar suas reservas
- Acessar "My Tickets" e "My Reservations"

### Administrador
- Todas as funcionalidades de usuário autenticado
- Acesso ao painel administrativo
- CRUD completo de voos
- CRUD completo de hotéis

##  Modelo de Dados

### Relacionamentos
```
User (1) ──────────── (N) Booking
Flight (1) ─────────── (N) Booking
Hotel (1) ──────────── (N) HotelBooking
User (1) ──────────── (N) HotelBooking
```

### Principais Entidades
- **Flight:** Informações do voo (companhia, origem, destino, horários, preço)
- **Hotel:** Informações do hotel (nome, localização, estrelas, preço)
- **Booking:** Reserva de voo com dados do passageiro
- **HotelBooking:** Reserva de hotel com dados do hóspede
- **User:** Usuário do sistema (admin ou comum)

##  Interface

A aplicação utiliza **Bootstrap 5** para garantir:
- Layout responsivo (mobile-first)
- Componentes modernos e acessíveis
- Navbar com dropdown de usuário
- Cards para exibição de voos e hotéis
- Formulários com validação

##  Scripts SQL

O arquivo `Database/create_tables.sql` contém:
- Criação do banco de dados `Travel`
- Tabelas: `Users`, `Flights`, `Hotels`, `Bookings`, `HotelBookings`
- Índices e Foreign Keys
- Usuário administrador inicial

##  Comandos Úteis

```bash
# Restaurar dependências
dotnet restore

# Compilar o projeto
dotnet build

# Executar em modo desenvolvimento
dotnet run

# Criar nova migration
dotnet ef migrations add NomeDaMigration

# Aplicar migrations
dotnet ef database update

# Reverter última migration
dotnet ef database update PreviousMigrationName
```

## Equipe

| Nome | Função | GitHub |
|------|--------|--------|
| Rennan Rangel | Desenvolvedor Front-End  | [@RennanRangel](https://github.com/RennanRangel) |


##  Licença

Este projeto foi desenvolvido para fins acadêmicos.

---

**"Que a Força dos códigos esteja com vocês — programar é como usar a Força: requer treino, foco e coragem para enfrentar os bugs do lado sombrio!"** 
