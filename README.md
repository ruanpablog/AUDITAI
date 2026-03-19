# AuditAí - Gestão Inteligente de Auditorias

O **AuditAí** é uma solução completa para gestão de auditorias, checklists e relatórios operacionais em tempo real. Projetado para ser rápido, intuitivo e sincronizado em todos os dispositivos.

## 🚀 Principais Funcionalidades

- **Auditoria em Tempo Real:** Realize checklists detalhados em campo com suporte a fotos e observações.
- **Sincronização em Nuvem (Supabase):** Seus dados são salvos automaticamente e sincronizados entre PC e Smartpone.
- **Relatórios Premium:** Geração de relatórios em PDF com layout profissional, assinaturas e KPIs de desempenho.
- **Dashboards:** Visualização clara de dados por loja, departamento e categorias.
- **Sincronia Inteligente:** Sistema de mesclagem (merge) que impede a perda de dados entre dispositivos com internet instável.
- **Configurações Mestre:** Base de dados pré-configurada com mais de 100 itens de monitoramento.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, Vanilla JavaScript, CSS3 (Custom Design System).
- **Backend/Database:** [Supabase](https://supabase.com/) (PostgreSQL + Realtime).
- **Ícones:** [Phosphor Icons](https://phosphoricons.com/).
- **Hospedagem:** [Vercel](https://vercel.com/) (Hospedagem Estática + CD/CI).

## 📂 Estrutura do Projeto

- `index.html`: Estrutura principal da aplicação (SPA).
- `app.js`: Lógica de negócio, autenticação e sincronização.
- `styles.css`: Sistema de design, responsividade e layout de impressão.
- `auditai_backup_usuario.json`: Arquivo de configuração mestre (Stores, Checklists).
- `patch_*.js`: Scripts de manutenção e atualizações específicas.

## ⚙️ Como Executar Localmente

1. Clone o repositório.
2. Abra o arquivo `index.html` em qualquer navegador.
3. Não é necessário servidor backend próprio; a conexão é direta com o Supabase.

---
*Desenvolvido com foco em excelência operacional.*
