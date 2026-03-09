    // --- State Management (LocalStorage DB) ---
    const defaultDepartments = [
        { id: 'd1', name: 'Açougue', weight: 1, color: '#ef4444' },
        { id: 'd2', name: 'Hortifruti', weight: 1, color: '#22c55e' },
        { id: 'd3', name: 'Frios', weight: 1, color: '#06b6d4' },
        { id: 'd4', name: 'Área de Vendas', weight: 1, color: '#f59e0b' },
        { id: 'd5', name: 'Frente de Loja', weight: 1, color: '#a855f7' },
        { id: 'd6', name: 'Depósito', weight: 1, color: '#64748b' },
        { id: 'd7', name: 'Recebimento', weight: 1, color: '#6366f1' },
        { id: 'd8', name: 'Avarias', weight: 1, color: '#ec4899' },
        { id: 'd9', name: 'Financeiro', weight: 1, color: '#10b981' },
        { id: 'd10', name: 'Logistica Entrada', weight: 1, color: '#3b82f6' }
    ];

    const defaultCategories = [
        { id: 'c1', name: 'Higiene e Sanificação', dept_id: 'd1', weight_value: 10, status: 'Ativo' },
        { id: 'c2', name: 'Controle de Temperaturas', dept_id: 'd1', weight_value: 10, status: 'Ativo' },
        { id: 'c3', name: 'Qualidade, Validade e Frescor', dept_id: 'd1', weight_value: 9, status: 'Ativo' },
        { id: 'c4', name: 'Organização e Exposição', dept_id: 'd1', weight_value: 7, status: 'Ativo' },
        { id: 'c5', name: 'Frescor e Qualidade dos Itens', dept_id: 'd2', weight_value: 9, status: 'Ativo' },
        { id: 'c6', name: 'Organização e Volume das Bancadas', dept_id: 'd2', weight_value: 8, status: 'Ativo' },
        { id: 'c7', name: 'Limpeza do Setor e Câmaras', dept_id: 'd2', weight_value: 7, status: 'Ativo' },
        { id: 'c8', name: 'Controle e Prevenção de Perdas', dept_id: 'd2', weight_value: 8, status: 'Ativo' },
        { id: 'c9', name: 'Cadeia de Frio e Temperaturas', dept_id: 'd3', weight_value: 10, status: 'Ativo' },
        { id: 'c10', name: 'Controle Rigoroso de Validade', dept_id: 'd3', weight_value: 10, status: 'Ativo' },
        { id: 'c11', name: 'Boas Práticas de Fatiamento', dept_id: 'd3', weight_value: 9, status: 'Ativo' },
        { id: 'c12', name: 'Abastecimento e Precificação', dept_id: 'd3', weight_value: 7, status: 'Ativo' },
        { id: 'c13', name: 'Limpeza de Gôndolas e Corredores', dept_id: 'd4', weight_value: 7, status: 'Ativo' },
        { id: 'c14', name: 'Precificação e Sinalização', dept_id: 'd4', weight_value: 9, status: 'Ativo' },
        { id: 'c15', name: 'Reposição e Frenteamento (Layout)', dept_id: 'd4', weight_value: 8, status: 'Ativo' },
        { id: 'c16', name: 'Abordagem e Atendimento', dept_id: 'd4', weight_value: 7, status: 'Ativo' },
        { id: 'c17', name: 'Saída de Mercadorias e Conferência', dept_id: 'd5', weight_value: 10, status: 'Ativo' },
        { id: 'c18', name: 'Outras Vendas (Delivery / iFood)', dept_id: 'd5', weight_value: 8, status: 'Ativo' },
        { id: 'c19', name: 'Vendas Balcão e Encomendas', dept_id: 'd5', weight_value: 7, status: 'Ativo' },
        { id: 'c20', name: 'Padrão de Atendimento (Checkout)', dept_id: 'd5', weight_value: 9, status: 'Ativo' },
        { id: 'c21', name: 'Organização e Endereçamento', dept_id: 'd6', weight_value: 8, status: 'Ativo' },
        { id: 'c22', name: 'Condições de Armazenamento', dept_id: 'd6', weight_value: 10, status: 'Ativo' },
        { id: 'c23', name: 'Sistema PEPS (Rodízio)', dept_id: 'd6', weight_value: 9, status: 'Ativo' },
        { id: 'c24', name: 'Limpeza e Descarte de Caixas', dept_id: 'd6', weight_value: 6, status: 'Ativo' },
        { id: 'c25', name: 'Conferência Cega e Qualidade', dept_id: 'd7', weight_value: 10, status: 'Ativo' },
        { id: 'c26', name: 'Limpeza e Agilidade na Doca', dept_id: 'd7', weight_value: 7, status: 'Ativo' },
        { id: 'c27', name: 'Triagem Imediata de Perecíveis', dept_id: 'd7', weight_value: 10, status: 'Ativo' },
        { id: 'c28', name: 'Organização e Segregação', dept_id: 'd8', weight_value: 9, status: 'Ativo' },
        { id: 'c29', name: 'Identificação e Registros não Sist.', dept_id: 'd8', weight_value: 9, status: 'Ativo' },
        { id: 'c30', name: 'Destinação Correta (Descarte)', dept_id: 'd8', weight_value: 10, status: 'Ativo' }
    ];

    const defaultChecklistItems = [
        { id: 'i1', cat_id: 'c1', dept_id: 'd1', question: 'Avalie o nível de higienização dos balcões de atendimento, pias e pisos (livres de resíduos).', eh_critico: true, status: 'Ativo' },
        { id: 'i2', cat_id: 'c1', dept_id: 'd1', question: 'Avalie a pureza e a limpeza atual das serras, moedores e facas após as trocas de corte.', eh_critico: true, status: 'Ativo' },
        { id: 'i3', cat_id: 'c1', dept_id: 'd1', question: 'Como está o estado dos ralos do setor (precisam estar limpos, tampados e sem odores)?', eh_critico: false, status: 'Ativo' },
        { id: 'i4', cat_id: 'c2', dept_id: 'd1', question: 'Avalie a temperatura das câmaras frias de resfriados e congelados segundo o padrão normativo.', eh_critico: true, status: 'Ativo' },
        { id: 'i5', cat_id: 'c2', dept_id: 'd1', question: 'Como está a aferição de temperatura dos balcões de exposição onde os clientes pegam as bandejas?', eh_critico: true, status: 'Ativo' },
        { id: 'i6', cat_id: 'c3', dept_id: 'd1', question: 'Avalie o frescor, a cor e o odor das carnes em exposição no balcão e gôndolas.', eh_critico: true, status: 'Ativo' },
        { id: 'i7', cat_id: 'c3', dept_id: 'd1', question: 'Como está o controle de validade e o recolhimento de carnes vencidas do setor?', eh_critico: true, status: 'Ativo' },
        { id: 'i8', cat_id: 'c3', dept_id: 'd1', question: 'Avalie a visibilidade de carimbos SIF/SIE e a rastreabilidade nas embalagens primárias.', eh_critico: false, status: 'Ativo' },
        { id: 'i9', cat_id: 'c4', dept_id: 'd1', question: 'Como está layout visual das carnes na vitrine (bandejas sem sangue, estética)?', eh_critico: false, status: 'Ativo' },
        { id: 'i10', cat_id: 'c4', dept_id: 'd1', question: 'Avalie a presença e a nitidez dos cartazes/etiquetas de preço nos cortes exportos.', eh_critico: false, status: 'Ativo' },
        { id: 'i11', cat_id: 'c5', dept_id: 'd2', question: 'Avalie a frequência de retirada de produtos machucados, murchos, fungados ou furados.', eh_critico: true, status: 'Ativo' },
        { id: 'i12', cat_id: 'c5', dept_id: 'd2', question: 'Como está a armazenagem e exposição das frutas folhosas para não encostarem no chão?', eh_critico: false, status: 'Ativo' },
        { id: 'i13', cat_id: 'c6', dept_id: 'd2', question: 'Avalie a sensação de abundância no setor (gôndolas fartas, sem buracos ou caixas).', eh_critico: false, status: 'Ativo' },
        { id: 'i14', cat_id: 'c6', dept_id: 'd2', question: 'Como está a adequação das etiquetas de preço aos produtos expostos atualmente?', eh_critico: false, status: 'Ativo' },
        { id: 'i15', cat_id: 'c7', dept_id: 'd2', question: 'Avalie a limpeza do piso deste setor (trânsitavel, seco e sem caldas/restos de folhagens).', eh_critico: false, status: 'Ativo' },
        { id: 'i16', cat_id: 'c7', dept_id: 'd2', question: 'Como está o cuidado na lavação das caixas plásticas no estoque do Hortifruit?', eh_critico: false, status: 'Ativo' },
        { id: 'i17', cat_id: 'c8', dept_id: 'd2', question: 'Avalie a rotação dos produtos, conferindo se os maduros lideram as frentes (PEPS).', eh_critico: false, status: 'Ativo' },
        { id: 'i18', cat_id: 'c8', dept_id: 'd2', question: 'Como está o manuseio dos abastecedores para evitar derrubar as mercadorias?', eh_critico: false, status: 'Ativo' },
        { id: 'i19', cat_id: 'c9', dept_id: 'd3', question: 'Avalie se a temperatura informada nos termômetros das ilhas de iogurtes está ideal.', eh_critico: true, status: 'Ativo' },
        { id: 'i20', cat_id: 'c9', dept_id: 'd3', question: 'Como está o respeito aos limites de "linha de enchimento" nas geladeiras?', eh_critico: false, status: 'Ativo' },
        { id: 'i21', cat_id: 'c10', dept_id: 'd3', question: 'Avalie a ausência de produtos vencidos nas gôndolas de alta saída.', eh_critico: true, status: 'Ativo' },
        { id: 'i22', cat_id: 'c10', dept_id: 'd3', question: 'Como está a aplicação pontual de datas de validade nas etiquetas de bandejas de frios?', eh_critico: true, status: 'Ativo' },
        { id: 'i23', cat_id: 'c11', dept_id: 'd3', question: 'Avalie o uso de EPIs corretos (luva de aço e touca) durante o processo de fatiamento.', eh_critico: true, status: 'Ativo' },
        { id: 'i24', cat_id: 'c11', dept_id: 'd3', question: 'Como está a assepsia (limpeza) da fatiadora e da tábua entre o queijo e o presunto?', eh_critico: true, status: 'Ativo' },
        { id: 'i25', cat_id: 'c12', dept_id: 'd3', question: 'Avalie o frenteamento de iogurtes, massas e lácteos nas prateleiras geladas.', eh_critico: false, status: 'Ativo' },
        { id: 'i26', cat_id: 'c12', dept_id: 'd3', question: 'Como está a conformidade dos preços reais com o layout da geladeira?', eh_critico: false, status: 'Ativo' },
        { id: 'i27', cat_id: 'c13', dept_id: 'd4', question: 'Avalie a ausência absoluta de pó grosso ou manchas no topo dos produtos das gôndolas.', eh_critico: false, status: 'Ativo' },
        { id: 'i28', cat_id: 'c13', dept_id: 'd4', question: 'Como está a fluidez dos corredores para o cliente sem paletes vazios esquecidos?', eh_critico: false, status: 'Ativo' },
        { id: 'i29', cat_id: 'c14', dept_id: 'd4', question: 'Avalie se 100% dos produtos visíveis estão com a etiqueta correta na prateleira inferior.', eh_critico: true, status: 'Ativo' },
        { id: 'i30', cat_id: 'c14', dept_id: 'd4', question: 'Como está a limpeza visual de cartazes (ausência de cartazes rasgados, invertidos)?', eh_critico: false, status: 'Ativo' },
        { id: 'i31', cat_id: 'c15', dept_id: 'd4', question: 'Avalie o alinhamento frontal das embalagens, com rótulos 100% visíveis ao cliente.', eh_critico: false, status: 'Ativo' },
        { id: 'i32', cat_id: 'c15', dept_id: 'd4', question: 'Como estão distribuídas as mercadorias para maquiar buracos de ruptura?', eh_critico: false, status: 'Ativo' },
        { id: 'i33', cat_id: 'c16', dept_id: 'd4', question: 'Avalie a postura e simpatia da equipe ao ser consultada por clientes.', eh_critico: false, status: 'Ativo' },
        { id: 'i34', cat_id: 'c16', dept_id: 'd4', question: 'Como está o uso unânime e impecável do vestuário e crachá-padrão?', eh_critico: false, status: 'Ativo' },
        { id: 'i35', cat_id: 'c17', dept_id: 'd5', question: 'Avalie se as grandes compras do caixa estão sendo vistoriadas pelos fiscais na porta.', eh_critico: true, status: 'Ativo' },
        { id: 'i36', cat_id: 'c17', dept_id: 'd5', question: 'Avalie o processo de conferência "embaixo dos carrinhos" esquecidos pelo cliente.', eh_critico: false, status: 'Ativo' },
        { id: 'i37', cat_id: 'c18', dept_id: 'd5', question: 'Como está a blindagem (lacres na sacola) das vendas feitas pelos Apps/Delivery?', eh_critico: true, status: 'Ativo' },
        { id: 'i38', cat_id: 'c18', dept_id: 'd5', question: 'Avalie a agilidade e o tempo de empacotamento das encomendas até o entregador.', eh_critico: false, status: 'Ativo' },
        { id: 'i39', cat_id: 'c19', dept_id: 'd5', question: 'Avalie a fluidez e a velocidade na entrega de encomendas agendadas (Salgados/Pães).', eh_critico: false, status: 'Ativo' },
        { id: 'i40', cat_id: 'c19', dept_id: 'd5', question: 'Como está o processo de conferência no SAC de Devoluções/Trocas de Mercadoria?', eh_critico: false, status: 'Ativo' },
        { id: 'i41', cat_id: 'c20', dept_id: 'd5', question: 'Avalie o sorriso ao cumprimentar do caixa e se evitam uso de celular.', eh_critico: false, status: 'Ativo' },
        { id: 'i42', cat_id: 'c20', dept_id: 'd5', question: 'Avalie se todas as balanças de caixa estão alinhadas, zeradas e estáveis na mesa.', eh_critico: true, status: 'Ativo' },
        { id: 'i43', cat_id: 'c20', dept_id: 'd5', question: 'Como está a execução das rotinas de sangria, trocos corretos e fundos limpos?', eh_critico: true, status: 'Ativo' },
        { id: 'i44', cat_id: 'c21', dept_id: 'd6', question: 'Avalie se as ruas/saídas de emergência principais não estão bloqueadas.', eh_critico: true, status: 'Ativo' },
        { id: 'i45', cat_id: 'c21', dept_id: 'd6', question: 'Como as caixas se encontram agrupadas no porta-paletes (ordem lógica visual)?', eh_critico: false, status: 'Ativo' },
        { id: 'i46', cat_id: 'c22', dept_id: 'd6', question: 'Avalie se TODO produto está livre de contato direto com o papelão no piso e na parede.', eh_critico: true, status: 'Ativo' },
        { id: 'i47', cat_id: 'c22', dept_id: 'd6', question: 'Como está o ambiente quanto à pragas (ausência de odores e ninhos soltos)?', eh_critico: false, status: 'Ativo' },
        { id: 'i48', cat_id: 'c23', dept_id: 'd6', question: 'Avalie a ordem de puxada para salão: Retira rigorosamente o lote que expira primeiro?', eh_critico: true, status: 'Ativo' },
        { id: 'i49', cat_id: 'c23', dept_id: 'd6', question: 'Como as caixas de papelão exibem a marcação lateral da data de validade com escrita legível?', eh_critico: false, status: 'Ativo' },
        { id: 'i50', cat_id: 'c24', dept_id: 'd6', question: 'Avalie o destino do lixo: papelões estão recolhidos em fardos amarrados no local adequado?', eh_critico: false, status: 'Ativo' },
        { id: 'i51', cat_id: 'c24', dept_id: 'd6', question: 'Como está a disciplina de empilhamento seguro de caixotes quebrados e embalagens vazias?', eh_critico: false, status: 'Ativo' },
        { id: 'i52', cat_id: 'c25', dept_id: 'd7', question: 'Avalie a rotina de checar a entrega da transportadora "às cegas" (sem posse da NFe).', eh_critico: true, status: 'Ativo' },
        { id: 'i53', cat_id: 'c25', dept_id: 'd7', question: 'Como constata-se a qualidade: Lotes vêm sem avarias explícitas da transportadora?', eh_critico: true, status: 'Ativo' },
        { id: 'i54', cat_id: 'c26', dept_id: 'd7', question: 'Avalie a presteza de varrer/lavar a plataforma assim que o caminhão termina de recuar.', eh_critico: false, status: 'Ativo' },
        { id: 'i55', cat_id: 'c26', dept_id: 'd7', question: 'Avalie a condução da fila e do estacionamento da recepção de forma que o pátio fique ágil.', eh_critico: false, status: 'Ativo' },
        { id: 'i56', cat_id: 'c27', dept_id: 'd7', question: 'Avalie se Produtos "de Câmara" (frios/carnes) são alocados lá dentro instantaneamente.', eh_critico: true, status: 'Ativo' },
        { id: 'i57', cat_id: 'c28', dept_id: 'd8', question: 'Avalie se a área de produtos avariados não entra em contato com produtos de consumo diários.', eh_critico: false, status: 'Ativo' },
        { id: 'i58', cat_id: 'c28', dept_id: 'd8', question: 'Como está o controle cruzado químico (produtos higiênicos rompidos) e alimentícios vencidos? Isolados?', eh_critico: true, status: 'Ativo' },
        { id: 'i59', cat_id: 'c29', dept_id: 'd8', question: 'Avalie se as quebras de seção/gôndola estão sendo reportadas e "baixadas" do sistema fiscal diariamente.', eh_critico: true, status: 'Ativo' },
        { id: 'i60', cat_id: 'c30', dept_id: 'd8', question: 'Avalie se latas que vazaram estão com isolamento lacrado que iniba mau cheiro no estoque.', eh_critico: false, status: 'Ativo' },
        { id: 'i61', cat_id: 'c30', dept_id: 'd8', question: 'Como atesta-se a descaracterização (massas que não prestam) para evitar catação de lixo orgânico impróprio?', eh_critico: false, status: 'Ativo' }
    ];

    const defaultStores = [
        { id: 's1', code: '001', name: 'Super Matriz Centro', city: 'São Paulo' },
        { id: 's2', code: '002', name: 'Filial Zona Sul', city: 'São Paulo' },
        { id: 's3', code: '003', name: 'Express Aeroporto', city: 'Guarulhos' }
    ];

    let activeCategoryId = null;

    // --- DOM Elements ---
    const authView = document.getElementById('auth-view');
    const appView = document.getElementById('app-view');

    // Auth Forms
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const errorMsg = document.getElementById('auth-error-msg');
    const pendingMsg = document.getElementById('pending-msg');

    // Sidebar & Mobile
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const btnMobileMenu = document.getElementById('btn-mobile-menu');
    const navBtns = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const btnLogout = document.getElementById('btn-logout');

    const sidebarAvatar = document.getElementById('sidebar-avatar');
    const sidebarUserName = document.getElementById('sidebar-user-name');
    const sidebarUserRole = document.getElementById('sidebar-user-role');

    // Audit Flow
    const auditProgress = document.getElementById('audit-progress-bar');
    const btnNextStep1 = document.getElementById('btn-next-step-1');
    const btnPrevStep2 = document.getElementById('btn-prev-step-2');
    const btnPrevStep3 = document.getElementById('btn-prev-step-3');
    const btnFinishAudit = document.getElementById('btn-finish-audit');
    const btnSaveDept = document.getElementById('btn-save-dept');

    let activeCategoryId = null;

    // Theme application
    const applyTheme = (color) => {
        const root = document.documentElement;
        const primaryColor = color || '#ef4444';
        const hoverColor = color ? adjustColor(color, -20) : '#dc2626';
        
        root.style.setProperty('--primary-dept', primaryColor);
        root.style.setProperty('--primary-dept-hover', hoverColor);
    };

    // --- Settings Persistence ---
    function loadSettings() {
        // Obsoleto
    }


    // --- State Management (LocalStorage DB) ---
    // Simulating the DB requested in Lovable prompt
    const defaultDepartments = [
        { id: 'd1', name: 'Açougue', weight: 1, color: '#ef4444' },
        { id: 'd2', name: 'Hortifruti', weight: 1, color: '#22c55e' },
        { id: 'd3', name: 'Frios', weight: 1, color: '#06b6d4' },
        { id: 'd4', name: 'Área de Vendas', weight: 1, color: '#f59e0b' },
        { id: 'd5', name: 'Frente de Loja', weight: 1, color: '#a855f7' },
        { id: 'd6', name: 'Depósito', weight: 1, color: '#64748b' },
        { id: 'd7', name: 'Recebimento', weight: 1, color: '#6366f1' },
        { id: 'd8', name: 'Avarias', weight: 1, color: '#ec4899' },
        { id: 'd9', name: 'Financeiro', weight: 1, color: '#10b981' },
        { id: 'd10', name: 'Logistica Entrada', weight: 1, color: '#3b82f6' }
    ];

    const defaultCategories = [
        { id: 'c1', name: 'Higiene e Sanificação', dept_id: 'd1', weight_value: 10, status: 'Ativo' },
        { id: 'c2', name: 'Controle de Temperaturas', dept_id: 'd1', weight_value: 10, status: 'Ativo' },
        { id: 'c3', name: 'Qualidade, Validade e Frescor', dept_id: 'd1', weight_value: 9, status: 'Ativo' },
        { id: 'c4', name: 'Organização e Exposição', dept_id: 'd1', weight_value: 7, status: 'Ativo' },

        { id: 'c5', name: 'Frescor e Qualidade dos Itens', dept_id: 'd2', weight_value: 9, status: 'Ativo' },
        { id: 'c6', name: 'Organização e Volume das Bancadas', dept_id: 'd2', weight_value: 8, status: 'Ativo' },
        { id: 'c7', name: 'Limpeza do Setor e Câmaras', dept_id: 'd2', weight_value: 7, status: 'Ativo' },
        { id: 'c8', name: 'Controle e Prevenção de Perdas', dept_id: 'd2', weight_value: 8, status: 'Ativo' },

        { id: 'c9', name: 'Cadeia de Frio e Temperaturas', dept_id: 'd3', weight_value: 10, status: 'Ativo' },
        { id: 'c10', name: 'Controle Rigoroso de Validade', dept_id: 'd3', weight_value: 10, status: 'Ativo' },
        { id: 'c11', name: 'Boas Práticas de Fatiamento', dept_id: 'd3', weight_value: 9, status: 'Ativo' },
        { id: 'c12', name: 'Abastecimento e Precificação', dept_id: 'd3', weight_value: 7, status: 'Ativo' },

        { id: 'c13', name: 'Limpeza de Gôndolas e Corredores', dept_id: 'd4', weight_value: 7, status: 'Ativo' },
        { id: 'c14', name: 'Precificação e Sinalização', dept_id: 'd4', weight_value: 9, status: 'Ativo' },
        { id: 'c15', name: 'Reposição e Frenteamento (Layout)', dept_id: 'd4', weight_value: 8, status: 'Ativo' },
        { id: 'c16', name: 'Abordagem e Atendimento', dept_id: 'd4', weight_value: 7, status: 'Ativo' },

        { id: 'c17', name: 'Saída de Mercadorias e Conferência', dept_id: 'd5', weight_value: 10, status: 'Ativo' },
        { id: 'c18', name: 'Outras Vendas (Delivery / iFood)', dept_id: 'd5', weight_value: 8, status: 'Ativo' },
        { id: 'c19', name: 'Vendas Balcão e Encomendas', dept_id: 'd5', weight_value: 7, status: 'Ativo' },
        { id: 'c20', name: 'Padrão de Atendimento (Checkout)', dept_id: 'd5', weight_value: 9, status: 'Ativo' },

        { id: 'c21', name: 'Organização e Endereçamento', dept_id: 'd6', weight_value: 8, status: 'Ativo' },
        { id: 'c22', name: 'Condições de Armazenamento', dept_id: 'd6', weight_value: 10, status: 'Ativo' },
        { id: 'c23', name: 'Sistema PEPS (Rodízio)', dept_id: 'd6', weight_value: 9, status: 'Ativo' },
        { id: 'c24', name: 'Limpeza e Descarte de Caixas', dept_id: 'd6', weight_value: 6, status: 'Ativo' },

        { id: 'c25', name: 'Conferência Cega e Qualidade', dept_id: 'd7', weight_value: 10, status: 'Ativo' },
        { id: 'c26', name: 'Limpeza e Agilidade na Doca', dept_id: 'd7', weight_value: 7, status: 'Ativo' },
        { id: 'c27', name: 'Triagem Imediata de Perecíveis', dept_id: 'd7', weight_value: 10, status: 'Ativo' },

        { id: 'c28', name: 'Organização e Segregação', dept_id: 'd8', weight_value: 9, status: 'Ativo' },
        { id: 'c29', name: 'Identificação e Registros não Sist.', dept_id: 'd8', weight_value: 9, status: 'Ativo' },
        { id: 'c30', name: 'Destinação Correta (Descarte)', dept_id: 'd8', weight_value: 10, status: 'Ativo' }
    ];

    const defaultChecklistItems = [
        // Açougue (d1)
        { id: 'i1', cat_id: 'c1', dept_id: 'd1', question: 'Avalie o nível de higienização dos balcões de atendimento, pias e pisos (livres de resíduos).', eh_critico: true, status: 'Ativo' },
        { id: 'i2', cat_id: 'c1', dept_id: 'd1', question: 'Avalie a pureza e a limpeza atual das serras, moedores e facas após as trocas de corte.', eh_critico: true, status: 'Ativo' },
        { id: 'i3', cat_id: 'c1', dept_id: 'd1', question: 'Como está o estado dos ralos do setor (precisam estar limpos, tampados e sem odores)?', eh_critico: false, status: 'Ativo' },
        { id: 'i4', cat_id: 'c2', dept_id: 'd1', question: 'Avalie a temperatura das câmaras frias de resfriados e congelados segundo o padrão normativo.', eh_critico: true, status: 'Ativo' },
        { id: 'i5', cat_id: 'c2', dept_id: 'd1', question: 'Como está a aferição de temperatura dos balcões de exposição onde os clientes pegam as bandejas?', eh_critico: true, status: 'Ativo' },
        { id: 'i6', cat_id: 'c3', dept_id: 'd1', question: 'Avalie o frescor, a cor e o odor das carnes em exposição no balcão e gôndolas.', eh_critico: true, status: 'Ativo' },
        { id: 'i7', cat_id: 'c3', dept_id: 'd1', question: 'Como está o controle de validade e o recolhimento de carnes vencidas do setor?', eh_critico: true, status: 'Ativo' },
        { id: 'i8', cat_id: 'c3', dept_id: 'd1', question: 'Avalie a visibilidade de carimbos SIF/SIE e a rastreabilidade nas embalagens primárias.', eh_critico: false, status: 'Ativo' },
        { id: 'i9', cat_id: 'c4', dept_id: 'd1', question: 'Como está layout visual das carnes na vitrine (bandejas sem sangue, estética)?', eh_critico: false, status: 'Ativo' },
        { id: 'i10', cat_id: 'c4', dept_id: 'd1', question: 'Avalie a presença e a nitidez dos cartazes/etiquetas de preço nos cortes exportos.', eh_critico: false, status: 'Ativo' },

        // Hortifruit (d2)
        { id: 'i11', cat_id: 'c5', dept_id: 'd2', question: 'Avalie a frequência de retirada de produtos machucados, murchos, fungados ou furados.', eh_critico: true, status: 'Ativo' },
        { id: 'i12', cat_id: 'c5', dept_id: 'd2', question: 'Como está a armazenagem e exposição das frutas folhosas para não encostarem no chão?', eh_critico: false, status: 'Ativo' },
        { id: 'i13', cat_id: 'c6', dept_id: 'd2', question: 'Avalie a sensação de abundância no setor (gôndolas fartas, sem buracos ou caixas).', eh_critico: false, status: 'Ativo' },
        { id: 'i14', cat_id: 'c6', dept_id: 'd2', question: 'Como está a adequação das etiquetas de preço aos produtos expostos atualmente?', eh_critico: false, status: 'Ativo' },
        { id: 'i15', cat_id: 'c7', dept_id: 'd2', question: 'Avalie a limpeza do piso deste setor (trânsitavel, seco e sem caldas/restos de folhagens).', eh_critico: false, status: 'Ativo' },
        { id: 'i16', cat_id: 'c7', dept_id: 'd2', question: 'Como está o cuidado na lavação das caixas plásticas no estoque do Hortifruit?', eh_critico: false, status: 'Ativo' },
        { id: 'i17', cat_id: 'c8', dept_id: 'd2', question: 'Avalie a rotação dos produtos, conferindo se os maduros lideram as frentes (PEPS).', eh_critico: false, status: 'Ativo' },
        { id: 'i18', cat_id: 'c8', dept_id: 'd2', question: 'Como está o manuseio dos abastecedores para evitar derrubar as mercadorias?', eh_critico: false, status: 'Ativo' },

        // Frios (d3)
        { id: 'i19', cat_id: 'c9', dept_id: 'd3', question: 'Avalie se a temperatura informada nos termômetros das ilhas de iogurtes está ideal.', eh_critico: true, status: 'Ativo' },
        { id: 'i20', cat_id: 'c9', dept_id: 'd3', question: 'Como está o respeito aos limites de "linha de enchimento" nas geladeiras?', eh_critico: false, status: 'Ativo' },
        { id: 'i21', cat_id: 'c10', dept_id: 'd3', question: 'Avalie a ausência de produtos vencidos nas gôndolas de alta saída.', eh_critico: true, status: 'Ativo' },
        { id: 'i22', cat_id: 'c10', dept_id: 'd3', question: 'Como está a aplicação pontual de datas de validade nas etiquetas de bandejas de frios?', eh_critico: true, status: 'Ativo' },
        { id: 'i23', cat_id: 'c11', dept_id: 'd3', question: 'Avalie o uso de EPIs corretos (luva de aço e touca) durante o processo de fatiamento.', eh_critico: true, status: 'Ativo' },
        { id: 'i24', cat_id: 'c11', dept_id: 'd3', question: 'Como está a assepsia (limpeza) da fatiadora e da tábua entre o queijo e o presunto?', eh_critico: true, status: 'Ativo' },
        { id: 'i25', cat_id: 'c12', dept_id: 'd3', question: 'Avalie o frenteamento de iogurtes, massas e lácteos nas prateleiras geladas.', eh_critico: false, status: 'Ativo' },
        { id: 'i26', cat_id: 'c12', dept_id: 'd3', question: 'Como está a conformidade dos preços reais com o layout da geladeira?', eh_critico: false, status: 'Ativo' },

        // Área de Vendas (d4)
        { id: 'i27', cat_id: 'c13', dept_id: 'd4', question: 'Avalie a ausência absoluta de pó grosso ou manchas no topo dos produtos das gôndolas.', eh_critico: false, status: 'Ativo' },
        { id: 'i28', cat_id: 'c13', dept_id: 'd4', question: 'Como está a fluidez dos corredores para o cliente sem paletes vazios esquecidos?', eh_critico: false, status: 'Ativo' },
        { id: 'i29', cat_id: 'c14', dept_id: 'd4', question: 'Avalie se 100% dos produtos visíveis estão com a etiqueta correta na prateleira inferior.', eh_critico: true, status: 'Ativo' },
        { id: 'i30', cat_id: 'c14', dept_id: 'd4', question: 'Como está a limpeza visual de cartazes (ausência de cartazes rasgados, invertidos)?', eh_critico: false, status: 'Ativo' },
        { id: 'i31', cat_id: 'c15', dept_id: 'd4', question: 'Avalie o alinhamento frontal das embalagens, com rótulos 100% visíveis ao cliente.', eh_critico: false, status: 'Ativo' },
        { id: 'i32', cat_id: 'c15', dept_id: 'd4', question: 'Como estão distribuídas as mercadorias para maquiar buracos de ruptura?', eh_critico: false, status: 'Ativo' },
        { id: 'i33', cat_id: 'c16', dept_id: 'd4', question: 'Avalie a postura e simpatia da equipe ao ser consultada por clientes.', eh_critico: false, status: 'Ativo' },
        { id: 'i34', cat_id: 'c16', dept_id: 'd4', question: 'Como está o uso unânime e impecável do vestuário e crachá-padrão?', eh_critico: false, status: 'Ativo' },

        // Frente de Loja (d5)
        { id: 'i35', cat_id: 'c17', dept_id: 'd5', question: 'Avalie se as grandes compras do caixa estão sendo vistoriadas pelos fiscais na porta.', eh_critico: true, status: 'Ativo' },
        { id: 'i36', cat_id: 'c17', dept_id: 'd5', question: 'Avalie o processo de conferência "embaixo dos carrinhos" esquecidos pelo cliente.', eh_critico: false, status: 'Ativo' },
        { id: 'i37', cat_id: 'c18', dept_id: 'd5', question: 'Como está a blindagem (lacres na sacola) das vendas feitas pelos Apps/Delivery?', eh_critico: true, status: 'Ativo' },
        { id: 'i38', cat_id: 'c18', dept_id: 'd5', question: 'Avalie a agilidade e o tempo de empacotamento das encomendas até o entregador.', eh_critico: false, status: 'Ativo' },
        { id: 'i39', cat_id: 'c19', dept_id: 'd5', question: 'Avalie a fluidez e a velocidade na entrega de encomendas agendadas (Salgados/Pães).', eh_critico: false, status: 'Ativo' },
        { id: 'i40', cat_id: 'c19', dept_id: 'd5', question: 'Como está o processo de conferência no SAC de Devoluções/Trocas de Mercadoria?', eh_critico: false, status: 'Ativo' },
        { id: 'i41', cat_id: 'c20', dept_id: 'd5', question: 'Avalie o sorriso ao cumprimentar do caixa e se evitam uso de celular.', eh_critico: false, status: 'Ativo' },
        { id: 'i42', cat_id: 'c20', dept_id: 'd5', question: 'Avalie se todas as balanças de caixa estão alinhadas, zeradas e estáveis na mesa.', eh_critico: true, status: 'Ativo' },
        { id: 'i43', cat_id: 'c20', dept_id: 'd5', question: 'Como está a execução das rotinas de sangria, trocos corretos e fundos limpos?', eh_critico: true, status: 'Ativo' },

        // Depósito (d6)
        { id: 'i44', cat_id: 'c21', dept_id: 'd6', question: 'Avalie se as ruas/saídas de emergência principais não estão bloqueadas.', eh_critico: true, status: 'Ativo' },
        { id: 'i45', cat_id: 'c21', dept_id: 'd6', question: 'Como as caixas se encontram agrupadas no porta-paletes (ordem lógica visual)?', eh_critico: false, status: 'Ativo' },
        { id: 'i46', cat_id: 'c22', dept_id: 'd6', question: 'Avalie se TODO produto está livre de contato direto com o papelão no piso e na parede.', eh_critico: true, status: 'Ativo' },
        { id: 'i47', cat_id: 'c22', dept_id: 'd6', question: 'Como está o ambiente quanto à pragas (ausência de odores e ninhos soltos)?', eh_critico: false, status: 'Ativo' },
        { id: 'i48', cat_id: 'c23', dept_id: 'd6', question: 'Avalie a ordem de puxada para salão: Retira rigorosamente o lote que expira primeiro?', eh_critico: true, status: 'Ativo' },
        { id: 'i49', cat_id: 'c23', dept_id: 'd6', question: 'Como as caixas de papelão exibem a marcação lateral da data de validade com escrita legível?', eh_critico: false, status: 'Ativo' },
        { id: 'i50', cat_id: 'c24', dept_id: 'd6', question: 'Avalie o destino do lixo: papelões estão recolhidos em fardos amarrados no local adequado?', eh_critico: false, status: 'Ativo' },
        { id: 'i51', cat_id: 'c24', dept_id: 'd6', question: 'Como está a disciplina de empilhamento seguro de caixotes quebrados e embalagens vazias?', eh_critico: false, status: 'Ativo' },

        // Recebimento (d7)
        { id: 'i52', cat_id: 'c25', dept_id: 'd7', question: 'Avalie a rotina de checar a entrega da transportadora "às cegas" (sem posse da NFe).', eh_critico: true, status: 'Ativo' },
        { id: 'i53', cat_id: 'c25', dept_id: 'd7', question: 'Como constata-se a qualidade: Lotes vêm sem avarias explícitas da transportadora?', eh_critico: true, status: 'Ativo' },
        { id: 'i54', cat_id: 'c26', dept_id: 'd7', question: 'Avalie a presteza de varrer/lavar a plataforma assim que o caminhão termina de recuar.', eh_critico: false, status: 'Ativo' },
        { id: 'i55', cat_id: 'c26', dept_id: 'd7', question: 'Avalie a condução da fila e do estacionamento da recepção de forma que o pátio fique ágil.', eh_critico: false, status: 'Ativo' },
        { id: 'i56', cat_id: 'c27', dept_id: 'd7', question: 'Avalie se Produtos "de Câmara" (frios/carnes) são alocados lá dentro instantaneamente.', eh_critico: true, status: 'Ativo' },

        // Avarias (d8)
        { id: 'i57', cat_id: 'c28', dept_id: 'd8', question: 'Avalie se a área de produtos avariados não entra em contato com produtos de consumo diários.', eh_critico: false, status: 'Ativo' },
        { id: 'i58', cat_id: 'c28', dept_id: 'd8', question: 'Como está o controle cruzado químico (produtos higiênicos rompidos) e alimentícios vencidos? Isolados?', eh_critico: true, status: 'Ativo' },
        { id: 'i59', cat_id: 'c29', dept_id: 'd8', question: 'Avalie se as quebras de seção/gôndola estão sendo reportadas e "baixadas" do sistema fiscal diariamente.', eh_critico: true, status: 'Ativo' },
        { id: 'i60', cat_id: 'c30', dept_id: 'd8', question: 'Avalie se latas que vazaram estão com isolamento lacrado que iniba mau cheiro no estoque.', eh_critico: false, status: 'Ativo' },
        { id: 'i61', cat_id: 'c30', dept_id: 'd8', question: 'Como atesta-se a descaracterização (massas que não prestam) para evitar catação de lixo orgânico impróprio?', eh_critico: false, status: 'Ativo' }
    ];

    const defaultStores = [
        { id: 's1', code: '001', name: 'Super Matriz Centro', city: 'São Paulo' },
        { id: 's2', code: '002', name: 'Filial Zona Sul', city: 'São Paulo' },
        { id: 's3', code: '003', name: 'Express Aeroporto', city: 'Guarulhos' }
    ];

    let db = {
        users: [],
        stores: defaultStores,
        departments: defaultDepartments,
        categories: defaultCategories,
        checklistItems: defaultChecklistItems,
        audits: [],
        companies: [],
        config: { emailjs_service: '', emailjs_template: '', emailjs_public_key: '' }
    };

    let currentUser = null;

    // Load from local storage
    const loadDB = () => {
        const stored = localStorage.getItem('auditai_db');
        if (stored) {
            try {
                let payload = JSON.parse(stored);
                
                // Suporte para migração (se for JSON antigo sem sig)
                if (!payload.sig && payload.users) {
                    db = payload;
                    saveDB(); // Converte para o novo formato
                    return;
                }

                const jsonStr = _deobfuscate(payload.data);
                if (!jsonStr) throw new Error("Falha na desofuscação");
                
                const currentChecksum = _genChecksum(jsonStr);
                if (currentChecksum !== payload.sig) {
                    alert("ALERTA DE SEGURANÇA: A integridade do banco de dados local foi violada ou os dados estão corrompidos. O acesso foi bloqueado para sua proteção.");
                    localStorage.removeItem('auditai_db');
                    window.location.reload();
                    return;
                }

                db = JSON.parse(jsonStr);
            } catch (e) {
                console.error("Erro ao carregar DB seguro:", e);
                // Fallback se JSON for inválido/antigo
                try { db = JSON.parse(stored); } catch(err) {} 
            }
        } else {
            // First time run, create default admin
            const adminUser = {
                id: 'admin_1',
                name: 'Admin Sistema',
                email: 'admin@auditai.com',
                pass: '123456',
                role: 'admin',
                status: 'aprovado'
            };
            
            db.users.push(adminUser);
            saveDB();
        }

        // Ensure necessary fields exist
        if (!db.companies) db.companies = [];
        if (!db.audits) db.audits = [];
        if (!db.config) db.config = { emailjs_service: '', emailjs_template: '', emailjs_public_key: '' };

                    // Force update checklist if they are old or lack dept_id
        const needsUpdate = !db.checklistItems || db.checklistItems.length < 50 || db.checklistItems.some(i => !i.dept_id);
        if (needsUpdate) {
            db.categories = defaultCategories;
            db.checklistItems = defaultChecklistItems;
            saveDB();
        }

        // Forçar os departamentos padrões a existirem se não estiverem no db
        if (!db.departments) db.departments = [];
        let deptsAdded = false;
        defaultDepartments.forEach(defDept => {
            if (!db.departments.find(d => d.id === defDept.id || (d.name||"").toLowerCase() === defDept.name.toLowerCase())) {
                db.departments.push(defDept);
                deptsAdded = true;
            }
        });
        if (deptsAdded) {
            saveDB();
        }

        // Distribuir peso 100% pelos departamentos caso não esteja configurado corretamente
        if (db.departments && db.departments.length > 0) {
            const totalW = db.departments.reduce((sum, d) => sum + (parseFloat(d.weight) || 0), 0);
            if (Math.abs(totalW - 100) > 1) { // se a soma dos pesos for diferente de 100%
                const baseWeight = 100 / db.departments.length;
                db.departments.forEach(d => {
                    d.weight = Math.round(baseWeight * 10) / 10; // 1 casa decimal
                });
                saveDB();
            }
        }

        // --- INJEÇÃO GLOBAL DO USUÁRIO RUAN ---
        const recoveryEmail = 'ruangomes221102@gmail.com';
        let ruanUser = db.users.find(u => u.email === recoveryEmail);
        if (!ruanUser) {
            ruanUser = {
                id: 'rec_ruan',
                name: 'Ruan Gomes',
                email: recoveryEmail,
                pass: '123456',
                role: 'admin',
                status: 'aprovado'
            };
            db.users.push(ruanUser);
        } else {
            // Se ele já existia, forçar a senha, aprovação e perfil de administrador
            ruanUser.pass = '123456';
            ruanUser.role = 'admin';
            ruanUser.status = 'aprovado';
            ruanUser.name = 'Ruan Gomes';
        }
        
        // Vincular à primeira empresa disponível
        if (db.companies && db.companies.length > 0 && (!ruanUser.companyId || ruanUser.companyId === '')) {
            ruanUser.companyId = db.companies[0].id;
        }
        saveDB();
    loadDB();

    const updateAuthUI = () => {
        if (currentUser) {
            if (currentUser.status === 'pendente') {
                // Bloqueio temporario na propria auth view
                authView.classList.remove('hidden');
                appView.classList.add('hidden');
                loginForm.classList.add('hidden');
                regForm.classList.add('hidden');
                tabLogin.classList.add('hidden');
                tabRegister.classList.add('hidden');
                errorMsg.innerText = '';
                pendingMsg.classList.remove('hidden');
            } else {
                                // Login completo
                authView.classList.add('hidden');
                appView.classList.remove('hidden');

                // Custom Company Identity
                if (currentUser.companyId && db.companies) {
                    const comp = db.companies.find(c => c.id === currentUser.companyId);
                    if (comp) {
                        if (comp.colors) {
                            document.documentElement.style.setProperty('--primary', comp.colors.primary);
                            document.documentElement.style.setProperty('--primary-hover', comp.colors.primary);
                            document.documentElement.style.setProperty('--secondary', comp.colors.secondary);
                            document.documentElement.style.setProperty('--accent', comp.colors.accent);
                        }
                        if (comp.logo) {
                            const brandSpan = document.querySelector('.sidebar-brand span');
                            const brandIcon = document.querySelector('.sidebar-brand i');
                            if (brandSpan && brandIcon) {
                                brandIcon.style.display = 'none';
                                brandSpan.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; width: 100%;"><img src="${comp.logo}" alt="Logo" style="max-height: 52px; filter: drop-shadow(0 0 2px rgba(0,0,0,0.5)); border-radius: 4px; object-fit: contain;"></div>`;
                            }
                        }
                    }
                }

                // Set UI
                sidebarUserName.innerText = currentUser.name.split(' ')[0];
                sidebarUserRole.innerText = currentUser.role === 'admin' ? 'Administrador' : (currentUser.role === 'manager' ? 'Gerente' : 'Auditor');
                sidebarAvatar.innerText = currentUser.name.charAt(0).toUpperCase();

                // Roles restrictions
                if (currentUser.role === 'admin') {
                    document.getElementById('nav-admin').classList.remove('hidden');
                } else {
                    document.getElementById('nav-admin').classList.add('hidden');
                }

                // Carrega dados pro dashboard e historico
                populateStores();
                renderAuditHistory();
                if(typeof renderScheduledAudits === 'function') renderScheduledAudits();
                renderAdminUsers();

                switchSection('audit-flow'); // Start with new audit
            }
        } else {
            authView.classList.remove('hidden');
            appView.classList.add('hidden');
        }
    };

    // Helpers para mostrar/esconder telas de auth
    const allAuthForms = ['login-form', 'register-form', 'forgot-form', 'reset-sent-msg', 'register-sent-msg'];
    const showAuthScreen = (id) => {
        allAuthForms.forEach(f => document.getElementById(f).classList.add('hidden'));
        if (id) document.getElementById(id).classList.remove('hidden');
    };
    const authTabsContainer = document.getElementById('auth-tabs-container');

    // Tabs toggle
    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active'); tabRegister.classList.remove('active');
        showAuthScreen('login-form');
        errorMsg.innerText = ''; pendingMsg.classList.add('hidden');
        authTabsContainer.style.display = '';
    });

    tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active'); tabLogin.classList.remove('active');
        showAuthScreen('register-form');
        errorMsg.innerText = ''; pendingMsg.classList.add('hidden');
        authTabsContainer.style.display = '';
    });

    // Link "Esqueceu a senha?"
    document.getElementById('btn-show-forgot').addEventListener('click', () => {
        showAuthScreen('forgot-form');
        authTabsContainer.style.display = 'none';
        errorMsg.innerText = '';
    });

    // Botão "Voltar ao Login" da tela de recuperação
    document.getElementById('btn-back-to-login').addEventListener('click', () => {
        showAuthScreen('login-form');
        authTabsContainer.style.display = '';
        tabLogin.classList.add('active'); tabRegister.classList.remove('active');
    });

    // Botão "Voltar ao Login" da tela de confirmação de reset
    document.getElementById('btn-back-login-from-reset').addEventListener('click', () => {
        showAuthScreen('login-form');
        authTabsContainer.style.display = '';
        tabLogin.classList.add('active'); tabRegister.classList.remove('active');
    });

    // Botão "Voltar ao Login" da tela de confirmação de cadastro
    document.getElementById('btn-back-login-from-register').addEventListener('click', () => {
        showAuthScreen('login-form');
        authTabsContainer.style.display = '';
        tabLogin.classList.add('active'); tabRegister.classList.remove('active');
    });

    // Enviar Link de Recuperação
    document.getElementById('btn-send-reset').addEventListener('click', () => {
        const email = document.getElementById('forgot-email').value.trim();
        if (!email) { errorMsg.innerText = 'Informe um e-mail válido.'; return; }

        const userFound = db.users.find(u => u.email === email);
        const resetCode = 'RST-' + Math.random().toString(36).substring(2,8).toUpperCase();

        if (userFound) {
            userFound.resetToken = resetCode;
            saveDB();

            const settings = JSON.parse(localStorage.getItem('auditai_settings') || '{}');
            if (typeof emailjs !== 'undefined' && settings.publicKey && settings.serviceId && settings.templateReset) {
                emailjs.send(settings.serviceId, settings.templateReset, {
                    to_email: email,
                    to_name: userFound.name || 'Usuário',
                    reset_code: resetCode
                }).catch(err => console.error('Erro ao enviar email:', err));
            } else {
                console.warn('EmailJS: credenciais não configuradas ou biblioteca não carregada.');
            }
        }
        // Sempre mostrar tela de enviado (por segurança, mesmo se email não existir)
        document.getElementById('reset-email-display').innerText = email;
        showAuthScreen('reset-sent-msg');
        authTabsContainer.style.display = 'none';
        errorMsg.innerText = '';
    });


    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-pass').value.trim();

        const user = db.users.find(u => u.email === email && u.pass === pass);
        if (user) {
            sessionStorage.setItem('auditai_session', user.email);
            currentUser = user;
            updateAuthUI();
        } else {
            errorMsg.innerText = "Credenciais incorretas!";
        }
    });

    // Register
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-pass').value;

        if (db.users.find(u => u.email === email)) {
            errorMsg.innerText = "E-mail já cadastrado!";
            return;
        }

        const newUser = {
            id: 'u_' + Date.now(),
            name, email, pass, role: 'none', companyId: null,
            status: 'pendente'
        };

        db.users.push(newUser);
        saveDB();

        // Enviar email de confirmação de cadastro via EmailJS
        const settings = JSON.parse(localStorage.getItem('auditai_settings') || '{}');
        if (typeof emailjs !== 'undefined' && settings.publicKey && settings.serviceId && settings.templateRegister) {
            emailjs.send(settings.serviceId, settings.templateRegister, {
                to_email: email,
                to_name: name
            }).catch(err => console.error('Erro ao enviar email de cadastro:', err));
        } else {
            console.warn('EmailJS: credenciais não configuradas ou biblioteca não carregada.');
        }

        // Mostrar tela de confirmação de cadastro (sem auto-login)
        document.getElementById('register-email-display').innerText = email;
        showAuthScreen('register-sent-msg');
        authTabsContainer.style.display = 'none';
        regForm.reset();
    });


    // Preencher campos quando clicar na aba
    document.querySelectorAll('#admin-view .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.getAttribute('data-tab') === 'admin-settings') loadSettings();
        });
    });

    // Logout
    btnLogout.addEventListener('click', () => {
        sessionStorage.removeItem('auditai_token');
        currentUser = null;
        updateAuthUI();
    });

    // ==========================================
    // NAVIGATION & MOBILE SIDEBAR
    // ==========================================
    const closeSidebar = () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    };

    btnMobileMenu.addEventListener('click', () => {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
    });
    sidebarOverlay.addEventListener('click', closeSidebar);

    const switchSection = (sectionId) => {
        contentSections.forEach(s => s.classList.add('hidden'));
        document.getElementById(sectionId).classList.remove('hidden');

        navBtns.forEach(b => b.classList.remove('active'));
        document.querySelector(`.nav-btn[data-target="${sectionId}"]`)?.classList.add('active');

        
        if (sectionId === 'scheduled-audits-view' && typeof renderScheduledAudits === 'function') {
            renderScheduledAudits();
        }

        if (window.innerWidth <= 900) closeSidebar();
    };

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchSection(btn.getAttribute('data-target'));
        });
    });

    // Check auth on load
    updateAuthUI();
// DOMContentLoaded now encompasses the entire file

    // ==========================================
    // AUDIT FLOW MODULE (STEP 1 -> STEP 2 -> STEP 3)
    // ==========================================
    
    let currentAudit = {
        id: null, storeId: null, date: null,
        managerName: '',
        departments: [] // Array of evaluated depts
    };
    let activeDeptId = null;
    let activeAuditType = 'padrao'; // 'padrao' ou 'retorno'
    let parentAuditId = null;
    let selectedStoreId = null;
    let deptResponsibleName = '';
    
    // --- Step 1: Select Store ---
    function populateStores() {
        const grid = document.getElementById('stores-grid');
        grid.innerHTML = '';
        
        let availableStores = db.stores;
        // User role specific filter? Manager sees only his store, let's keep it simple for now and show all. 

        availableStores.forEach(s => {
            const card = document.createElement('div');
            card.className = 'glass select-card';
            
            // Buscar empresa para pegar a logo
            const comp = db.companies.find(c => c.id === s.companyId);
            const logoHtml = comp && comp.logo ? 
                `<img src="${comp.logo}" alt="Logo" style="height: 48px; object-fit: contain; margin-bottom: 12px; border-radius: 4px;">` : 
                `<i class="ph ph-storefront card-icon"></i>`;

            card.innerHTML = `
                ${logoHtml}
                <h4 style="margin: 0;">${s.name}</h4>
            `;            
            card.addEventListener('click', () => {
                selectedStoreId = s.id;
                document.querySelectorAll('.select-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                
                // Avançar automaticamente para seleção de tipo
                document.getElementById('type-selection-store-title').innerText = s.name;
                document.getElementById('current-store-title').innerText = s.name;
                
                document.getElementById('step-1').classList.add('hidden');
                document.getElementById('step-audit-type').classList.remove('hidden');
                updateProgressBar(0.5);
            });
            grid.appendChild(card);
        });
    }

    // --- Type Selection Handlers ---
    document.getElementById('btn-type-standard').addEventListener('click', () => {
        activeAuditType = 'padrao';
        parentAuditId = null;
        
        currentAudit.storeId = selectedStoreId;
        currentAudit.id = 'aud_' + Date.now();
        currentAudit.date = new Date().toISOString();
        currentAudit.departments = [];
        currentAudit.type = 'padrao';
        currentAudit.managerName = '';
        currentAudit.supervisorName = '';

        document.getElementById('audit-manager-name').value = '';
        document.getElementById('audit-supervisor-name').value = '';

        document.getElementById('step-audit-type').classList.add('hidden');
        document.getElementById('step-2').classList.remove('hidden');
        updateProgressBar(1);
        populateDepts();
    });

    document.getElementById('btn-type-followup').addEventListener('click', () => {
        activeAuditType = 'retorno';
        renderFollowUpSelection();
        
        document.getElementById('audit-manager-name').value = '';
        document.getElementById('audit-supervisor-name').value = '';
        document.getElementById('step-audit-type').classList.add('hidden');
        document.getElementById('step-followup-selection').classList.remove('hidden');
        updateProgressBar(0.75);
    });

    document.getElementById('btn-prev-step-type').addEventListener('click', () => {
        document.getElementById('step-audit-type').classList.add('hidden');
        document.getElementById('step-1').classList.remove('hidden');
        updateProgressBar(0);
    });

    document.getElementById('btn-prev-step-followup').addEventListener('click', () => {
        document.getElementById('step-followup-selection').classList.add('hidden');
        document.getElementById('step-audit-type').classList.remove('hidden');
        updateProgressBar(0.5);
    });

    function renderFollowUpSelection() {
        const container = document.getElementById('followup-list-container');
        container.innerHTML = '';

        // Buscar auditorias finalizadas desta loja que tenham itens Ruim/Insuficiente
        const storeAudits = db.audits.filter(a => a.storeId === selectedStoreId);
        
        if (storeAudits.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding:20px; color:var(--text-muted);">Nenhuma auditoria anterior encontrada para esta loja.</p>';
            return;
        }

        storeAudits.forEach(audit => {
            // Verificar se tem falhas
            let hasFailures = false;
            audit.departments.forEach(d => {
                if (d.responses.some(r => r.value === 'ruim' || r.value === 'insuficiente')) {
                    hasFailures = true;
                }
            });

            if (!hasFailures) return;

            const card = document.createElement('div');
            card.className = 'glass select-card';
            const date = new Date(audit.date).toLocaleDateString('pt-BR');
            
            card.innerHTML = `
                <i class="ph ph-calendar-check card-icon" style="color:var(--danger);"></i>
                <h4>Auditoria de ${date}</h4>
                <p>Score: ${audit.totalScore || 0}%</p>
                <button class="btn btn-primary" style="margin-top:12px;">Selecionar para Retorno</button>
            `;

            card.addEventListener('click', () => {
                parentAuditId = audit.id;
                
                currentAudit.storeId = selectedStoreId;
                currentAudit.id = 'aud_ret_' + Date.now();
                currentAudit.date = new Date().toISOString();
                currentAudit.departments = [];
                currentAudit.type = 'retorno';
                currentAudit.parentAuditId = parentAuditId;

                document.getElementById('step-followup-selection').classList.add('hidden');
                document.getElementById('step-2').classList.remove('hidden');
                updateProgressBar(1);
                populateDepts();
            });

            container.appendChild(card);
        });

        if (container.innerHTML === '') {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding:20px; color:var(--text-muted);">Todas as auditorias anteriores desta loja estão com 100% de conformidade!</p>';
        }
    }

    // --- Step 2: Select Department ---
    function populateDepts() {
        const grid = document.getElementById('depts-grid');
        grid.innerHTML = '';

        const getDeptIcon = (name) => {
            const n = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos
            if (n.includes('acougue')) return 'ph-knife';
            if (n.includes('hortifruit') || n.includes('flv')) return 'ph-leaf';
            if (n.includes('frios') || n.includes('laticinios')) return 'ph-thermometer';
            if (n.includes('vendas') || n.includes('mercearia')) return 'ph-shopping-bag';
            if (n.includes('frente') || n.includes('caixa')) return 'ph-keyboard';
            if (n.includes('deposito') || n.includes('estoque')) return 'ph-package';
            if (n.includes('recebimento')) return 'ph-truck';
            if (n.includes('avaria')) return 'ph-warning-octagon';
            return 'ph-buildings';
        };

        db.departments.forEach(d => {
            // Se for auditoria de retorno, verificar se este depto tem falhas na auditoria pai
            if (activeAuditType === 'retorno' && parentAuditId) {
                const parentAudit = db.audits.find(a => a.id === parentAuditId);
                const parentDept = parentAudit.departments.find(pd => pd.deptId === d.id);
                if (!parentDept || !parentDept.responses.some(r => r.value === 'ruim' || r.value === 'insuficiente')) {
                    return; // Pular depto sem falhas
                }
            }

            const isAudited = currentAudit.departments.find(x => x.deptId === d.id);
            
            const card = document.createElement('div');
            card.className = 'glass select-card';
            if (isAudited) {
                card.style.border = '2px solid var(--primary)';
                card.style.background = 'var(--primary-dept-bg)';
            }

            const icon = getDeptIcon(d.name);
            
            card.innerHTML = `
                <i class="ph ${icon} card-icon"></i>
                <h4>${d.name}</h4>
            `;
            
            card.addEventListener('click', () => {
                if(isAudited) {
                    alert('Este departamento já foi auditado nesta sessão.');
                    return;
                }
                
                const mName = document.getElementById('audit-manager-name').value;
                if(!mName) { alert('Informe o nome do Gerente da Loja antes de iniciar!'); return; }
                currentAudit.managerName = mName;

                activeDeptId = d.id;
                deptResponsibleName = ''; // Reset responsible name for new dept
                
                // Aplicar Tema do Departamento
                applyTheme(d.color);

                document.getElementById('cat-selection-store-dept').innerText = d.name;
                
                document.getElementById('step-2').classList.add('hidden');
                document.getElementById('step-cat-selection').classList.remove('hidden');
                updateProgressBar(1.5); // Passo intermediário
                populateCategoriesSelection(d.id);
            });

            grid.appendChild(card);
        });

        if(currentAudit.departments.length > 0) {
            document.getElementById('btn-finish-audit').classList.remove('hidden');
        }
    }

    document.getElementById('btn-prev-step-2').addEventListener('click', () => {
        applyTheme(null); // Reset para Vermelho (Padrão do App)
        document.getElementById('step-2').classList.add('hidden');
        document.getElementById('step-1').classList.remove('hidden');
        updateProgressBar(0);
    });

    // --- Step 2.5: Select Category ---
    function populateCategoriesSelection(deptId) {
        const grid = document.getElementById('categories-grid');
        grid.innerHTML = '';

        const deptCats = db.categories.filter(c => c.dept_id === deptId);

        deptCats.forEach(c => {
            // Se for retorno, verificar se esta categoria tem falhas na auditoria pai
            if (activeAuditType === 'retorno' && parentAuditId) {
                const parentAudit = db.audits.find(a => a.id === parentAuditId);
                const parentDept = parentAudit.departments.find(pd => pd.deptId === deptId);
                const hasFailInCat = parentDept.responses.some(r => {
                    const item = db.checklistItems.find(i => i.id === r.itemId);
                    return item && item.cat_id === c.id && (r.value === 'ruim' || r.value === 'insuficiente');
                });
                if (!hasFailInCat) return; // Pular categoria sem falhas
            }

            const isDone = currentAudit.tempResponses && currentAudit.tempResponses.find(r => r.catId === c.id);
            
            const card = document.createElement('div');
            card.className = 'glass select-card';
            if (isDone) {
                card.style.borderColor = 'var(--primary-dept)';
                card.style.background = 'rgba(239, 68, 68, 0.05)';
            }
            
            card.innerHTML = `
                <i class="ph ph-clipboard-text card-icon"></i>
                <h4>${c.name}</h4>
                <p>Peso: ${(c.weight_value || 10).toFixed(1)}</p>
                <div style="margin-top:12px;">
                    ${isDone ? '<span class="badge badge-success">CONCLUÍDO</span>' : '<span class="badge badge-muted">PENDENTE</span>'}
                </div>
                <button class="btn btn-ghost" style="margin-top:8px; color:var(--primary);">Selecionar</button>
            `;

            card.addEventListener('click', () => {
                activeCategoryId = c.id;
                document.getElementById('current-dept-title').innerText = c.name;
                
                document.getElementById('step-cat-selection').classList.add('hidden');
                document.getElementById('step-3').classList.remove('hidden');
                updateProgressBar(2);
                populateCategoriesAndItems(c.id);
            });

            grid.appendChild(card);
        });

        // Botão para finalizar o departamento inteiro
        const finishSection = document.createElement('div');
        finishSection.style.gridColumn = '1 / -1';
        finishSection.style.textAlign = 'center';
        finishSection.style.marginTop = '20px';
        
        const btnFinishDept = document.createElement('button');
        btnFinishDept.className = 'btn';
        btnFinishDept.style.background = 'linear-gradient(135deg, var(--primary-dept), var(--primary-dept-hover))';
        btnFinishDept.style.color = 'white';
        btnFinishDept.style.boxShadow = '0 4px 14px rgba(239, 68, 68, 0.35)';
        btnFinishDept.innerHTML = 'Finalizar Todo o Setor <i class="ph ph-check-circle"></i>';
        
        btnFinishDept.addEventListener('click', () => {
            finalizeDepartment();
        });

        finishSection.appendChild(btnFinishDept);
        grid.appendChild(finishSection);
    }

    function finalizeDepartment() {
        const respName = document.getElementById('dept-responsible-name').value;
        // In this flow, we might need to ask for the name again or keep it from step 2
        
        // Filter responses for this dept
        const deptResponses = currentAudit.tempResponses.filter(r => {
            const item = db.checklistItems.find(i => i.id === r.itemId);
            return item && item.dept_id === activeDeptId;
        });

        if (deptResponses.length === 0) { alert('Responda pelo menos uma categoria!'); return; }

        let earned = 0; let total = deptResponses.length * 10;
        deptResponses.forEach(r => {
            if(r.value === 'excelente') earned += 10;
            if(r.value === 'bom') earned += 7;
            if(r.value === 'insuficiente') earned += 3;
        });

        const percentage = Math.round((earned / total) * 100);

        currentAudit.departments.push({
            deptId: activeDeptId,
            responsible: respName || 'Equipe',
            score: earned,
            maxScore: total,
            percentage: percentage,
            responses: deptResponses
        });

        // Limpa temporários deste depto (opcional)
        // currentAudit.tempResponses = currentAudit.tempResponses.filter(...)

        applyTheme(null); // Volta pro Vermelho Padrão
        document.getElementById('step-cat-selection').classList.add('hidden');
        document.getElementById('step-2').classList.remove('hidden');
        updateProgressBar(1);
        populateDepts();
    }

    document.getElementById('btn-prev-step-cat').addEventListener('click', () => {
        if(currentAudit.tempResponses && currentAudit.tempResponses.length > 0) {
            if(!confirm('As respostas deste departamento ainda não foram consolidadas. Deseja realmente sair sem salvar?')) return;
            currentAudit.tempResponses = []; // Limpa se sair
        }
        document.getElementById('step-cat-selection').classList.add('hidden');
        document.getElementById('step-2').classList.remove('hidden');
        updateProgressBar(1);
    });

    document.getElementById('btn-finish-dept').addEventListener('click', () => {
        if (!currentAudit.tempResponses || currentAudit.tempResponses.length === 0) {
            alert('Você precisa avaliar pelo menos uma categoria antes de concluir o departamento!');
            return;
        }

        const respEl = document.getElementById('dept-responsible-name');
        const respName = (respEl && respEl.value) ? respEl.value : deptResponsibleName;
        if (!respName) {
            alert('Por favor, informe o nome do responsável pelo setor em pelo menos uma categoria!');
            return;
        }

        // Calcular Percentual do Departamento
        // Regra: Média simples dos itens respondidos (ou peso por categoria se houver)
        let totalScore = 0;
        const scoreValues = { 'excelente': 100, 'bom': 80, 'regular': 60, 'ruim': 30, 'insuficiente': 0 };
        
        currentAudit.tempResponses.forEach(r => {
            totalScore += scoreValues[r.value] || 0;
        });

        const deptPercentage = Math.round(totalScore / currentAudit.tempResponses.length);

        // Salvar no currentAudit.departments
        // Remover duplicata se houver
        currentAudit.departments = currentAudit.departments.filter(d => d.deptId !== activeDeptId);
        
        currentAudit.departments.push({
            deptId: activeDeptId,
            responsible: respName,
            percentage: deptPercentage,
            responses: [...currentAudit.tempResponses]
        });

        // Limpar temporários
        currentAudit.tempResponses = [];

        // Voltar para seleção de departamentos
        document.getElementById('step-cat-selection').classList.add('hidden');
        document.getElementById('step-2').classList.remove('hidden');
        updateProgressBar(1);
        populateDepts(); // Recarregar para mostrar status visual de concluído
        
        // Mostrar botão de finalizar auditoria se houver depts concluídos
        if (currentAudit.departments.length > 0) {
            document.getElementById('btn-finish-audit').classList.remove('hidden');
        }
    });

    // --- Step 3: Evaluate Categories & Items ---
    function populateCategoriesAndItems(categoryId) {
        const container = document.getElementById('categories-container');
        container.innerHTML = '';

        // Filter only items belonging to the active department AND selected category
        let items = db.checklistItems.filter(i => i.dept_id === activeDeptId && i.cat_id === categoryId);

        // Se for retorno, filtrar apenas itens reprovados na auditoria pai
        if (activeAuditType === 'retorno' && parentAuditId) {
            const parentAudit = db.audits.find(a => a.id === parentAuditId);
            const parentDept = parentAudit.departments.find(pd => pd.deptId === activeDeptId);
            
            items = items.filter(i => {
                const response = parentDept.responses.find(r => r.itemId === i.id);
                return response && (response.value === 'ruim' || response.value === 'insuficiente');
            });
        }

        if (items.length === 0) {
            container.innerHTML = `
                <div class="glass" style="padding:32px; text-align:center;">
                    <i class="ph ph-mask-sad" style="font-size:2.5rem; color:var(--text-muted);"></i>
                    <p style="margin-top:12px; color:var(--text-muted);">Nenhum item cadastrado para esta categoria.</p>
                </div>`;
            return;
        }

        const cat = db.categories.find(c => c.id === categoryId);
        
        const sec = document.createElement('div');
        sec.className = 'glass';
        sec.style.padding = '20px';
        sec.style.marginBottom = '20px';
        
        let html = `<h4 style="margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">${cat ? cat.name : 'Avaliação'}</h4>`;
        
        items.forEach(item => {
            const criticoBadge = item.eh_critico ? '<span class="badge badge-danger">CRÍTICO</span>' : '';
            
            // Referência de "Antes" se for retorno
            let beforePhotoHtml = '';
            if (activeAuditType === 'retorno' && parentAuditId) {
                const parentAudit = db.audits.find(a => a.id === parentAuditId);
                const parentDept = parentAudit.departments.find(pd => pd.deptId === activeDeptId);
                const parentResp = parentDept.responses.find(r => r.itemId === item.id);
                
                if (parentResp && parentResp.photos && parentResp.photos.length > 0) {
                    beforePhotoHtml = `
                        <div class="before-photo-ref" style="margin: 10px 0; padding: 10px; background: rgba(239, 68, 68, 0.1); border-radius: 8px;">
                            <p style="font-size: 0.75rem; color: var(--danger); font-weight: 600; margin-bottom: 5px;">⚠️ SITUAÇÃO ANTERIOR (ONTEM/PASSADO):</p>
                            <img src="${parentResp.photos[0]}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 4px; border: 2px solid var(--danger);">
                            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 5px;"><i>"${parentResp.observation || 'Sem observação'}"</i></p>
                        </div>
                    `;
                }
            }

            html += `
                <div class="audit-item" data-item="${item.id}" style="margin-bottom: 24px;">
                    <p style="font-weight: 500; margin-bottom: 8px;">${item.question} ${criticoBadge}</p>
                    ${beforePhotoHtml}
                    <div class="rating-group">
                        <button class="rating-btn ruim" data-val="ruim"><i class="ph ph-x-circle"></i> Ruim</button>
                         <button class="rating-btn insuficiente" data-val="insuficiente"><i class="ph ph-warning-circle"></i> Insuficiente</button>
                         <button class="rating-btn bom" data-val="bom"><i class="ph ph-check-circle"></i> Bom</button>
                         <button class="rating-btn excelente" data-val="excelente"><i class="ph ph-star"></i> Excelente</button>
                    </div>
                    <textarea class="item-obs hidden" placeholder="Justifique (Obrigatório para Ruim)" style="margin-top: 8px;"></textarea>
                    <button class="btn btn-ghost btn-add-photo" style="margin-top: 8px; font-size: 0.85rem;"><i class="ph ph-camera"></i> Adicionar Foto</button>
                    <input type="file" class="hidden-photo-input hidden" accept="image/*">
                    <div class="photo-preview-container" style="margin-top: 8px; display: none;"></div>
                </div>
            `;
        });

        sec.innerHTML = html;
        container.appendChild(sec);


        // Add event listeners to rating buttons
        document.querySelectorAll('.audit-item').forEach(itemEl => {
            const btns = itemEl.querySelectorAll('.rating-btn');
            const obsEl = itemEl.querySelector('.item-obs');
            const btnAddPhoto = itemEl.querySelector('.btn-add-photo');
            const fileInput = itemEl.querySelector('.hidden-photo-input');
            const previewContainer = itemEl.querySelector('.photo-preview-container');

            if(btnAddPhoto && fileInput) {
                btnAddPhoto.addEventListener('click', () => {
                    fileInput.click();
                });

                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if(!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        const base64 = ev.target.result;
                        itemEl.dataset.photoBase64 = base64;
                        previewContainer.innerHTML = `<img src="${base64}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border); margin-top: 8px;">`;
                        previewContainer.style.display = 'block';
                        btnAddPhoto.innerHTML = '<i class="ph ph-camera-rotate"></i> Trocar Foto';
                    };
                    reader.readAsDataURL(file);
                });
            }

            btns.forEach(b => {
                b.addEventListener('click', () => {
                    btns.forEach(x => x.classList.remove('active'));
                    b.classList.add('active');
                    
                    if(b.dataset.val === 'ruim' || b.dataset.val === 'insuficiente') {
                        obsEl.classList.remove('hidden');
                        obsEl.setAttribute('required', 'true');
                    } else {
                        obsEl.classList.add('hidden');
                        obsEl.removeAttribute('required');
                    }
                });
            });
        });
    }

    document.getElementById('btn-prev-step-3').addEventListener('click', () => {
        document.getElementById('step-3').classList.add('hidden');
        document.getElementById('step-cat-selection').classList.remove('hidden');
        updateProgressBar(1.5);
    });

    document.getElementById('btn-save-dept').addEventListener('click', () => {
        const respNameEl = document.getElementById('dept-responsible-name');
        const respName = respNameEl ? respNameEl.value : deptResponsibleName;
        if(!respName) { alert('Informe o nome do responsável pelo setor!'); return; }
        deptResponsibleName = respName; // Save to memory for btn-finish-dept

        let allAnswered = true;
        let catResponses = [];

        document.querySelectorAll('.audit-item').forEach(itemEl => {
            const activeBtn = itemEl.querySelector('.rating-btn.active');
            if(!activeBtn) { allAnswered = false; return; }

            const val = activeBtn.dataset.val;
            const obs = itemEl.querySelector('.item-obs').value;
            
            if(val === 'ruim' && !obs) {
                allAnswered = false;
                itemEl.querySelector('.item-obs').style.borderColor = 'var(--danger)';
            }

            const photo64 = itemEl.dataset.photoBase64;
            catResponses.push({
                itemId: itemEl.dataset.item,
                catId: activeCategoryId,
                value: val,
                observations: obs,
                photos: photo64 ? [photo64] : []
            });
        });

        if(!allAnswered) {
            alert('Por favor, responda todos os itens da categoria!');
            return;
        }

        // Store responses temporarily in currentAudit
        if (!currentAudit.tempResponses) currentAudit.tempResponses = [];
        // Remove old responses for this category if any
        currentAudit.tempResponses = currentAudit.tempResponses.filter(r => r.catId !== activeCategoryId);
        currentAudit.tempResponses.push(...catResponses);

        // Go back to category selection
        document.getElementById('step-3').classList.add('hidden');
        document.getElementById('step-cat-selection').classList.remove('hidden');
        updateProgressBar(1.5);
        populateCategoriesSelection(activeDeptId);
    });

    // --- Finish Audit ---
    document.getElementById('btn-finish-audit').addEventListener('click', () => {
        let hasCritical = false;
        currentAudit.departments.forEach(d => {
            d.responses.forEach(r => {
                if(r.value === 'ruim' || r.value === 'insuficiente') hasCritical = true;
            });
        });

        if (hasCritical) {
            document.getElementById('input-return-date').value = '';
            document.getElementById('modal-return-date').classList.remove('hidden');
        } else {
            if(confirm('Deseja concluir a auditoria? Todos os itens foram aprovados e não há pendências de retorno.')) {
                currentAudit.returnDate = null;
                saveAuditFinal();
            }
        }
    });

    document.getElementById('btn-confirm-return-date').addEventListener('click', () => {
        const val = document.getElementById('input-return-date').value;
        if (!val) {
            alert('A data de retorno é obrigatória para Lojas com pontos críticos!');
            return;
        }
        currentAudit.returnDate = val + 'T00:00:00';
        document.getElementById('modal-return-date').classList.add('hidden');
        saveAuditFinal();
    });

    function saveAuditFinal() {
        // Calculate total score based on Department Weights (Total 100%)
        let totalWeightedPercentage = 0;
        let totalWeightsAudited = 0;

        currentAudit.departments.forEach(d => {
            // Find department in DB to get its weight
            const dbDept = db.departments.find(x => x.id === d.deptId);
            // Defina um peso padrão caso não hajaá (ex: 10 para 10 depts = 100%)
            const weight = dbDept && dbDept.weight ? parseFloat(dbDept.weight) : 10; 
            
            // d.percentage is the score 0-100 for this dept
            totalWeightedPercentage += (d.percentage * weight);
            totalWeightsAudited += weight;
        });

        // Current Audit Final Percentage is the weighted average
        if (totalWeightsAudited > 0) {
            currentAudit.percentage = Math.round(totalWeightedPercentage / totalWeightsAudited);
        } else {
            currentAudit.percentage = 0;
        }
        
        let rank = 'Insuficiente';
        if(currentAudit.percentage >= 100) rank = 'Excelente';
        else if (currentAudit.percentage >= 70) rank = 'Bom';
        else if (currentAudit.percentage >= 50) rank = 'Regular';
        
        currentAudit.classification = rank;
        currentAudit.auditor = currentUser.name;
        
        // Capturar Gerente e Encarregado da Loja
        currentAudit.managerName = document.getElementById('audit-manager-name').value;
        currentAudit.supervisorName = document.getElementById('audit-supervisor-name').value;

        db.audits.push(JSON.parse(JSON.stringify(currentAudit))); // deep copy
        saveDB();

        // Reset Memory
        currentAudit = { id: null, storeId: null, date: null, managerName: '', supervisorName: '', departments: [] };
        
        // Show Report
        const jáustSaved = db.audits[db.audits.length - 1];
        showReport(jáustSaved);
    }

    function updateProgressBar(stepIndex) {
        const bar = document.getElementById('audit-progress-bar');
        bar.innerHTML = '';
        for(let i=0; i<3; i++) {
            const d = document.createElement('div'); d.className = 'step-dot';
            if(i < stepIndex) d.classList.add('done');
            else if(i === stepIndex) d.classList.add('current');
            bar.appendChild(d);
        }
    }
    updateProgressBar(0);


    // ==========================================
    // REPORT VIEW MODULE
    // ==========================================
    function showReport(auditObj) {
        document.getElementById('audit-flow').classList.add('hidden');
        document.getElementById('report-view').classList.remove('hidden');
        document.body.classList.add('viewing-report'); // Esconde barras superiores

        // Reset followup container
        const followUpContainer = document.getElementById('report-followup-container');
        const followUpComparison = document.getElementById('report-followup-comparison');
        if (followUpContainer) followUpContainer.classList.add('hidden');
        if (followUpComparison) followUpComparison.innerHTML = '';

        if (auditObj.type === 'retorno' && auditObj.parentAuditId) {
            renderReportFollowUpComparison(auditObj);
        }

        if (auditObj.type === 'retorno' && auditObj.parentAuditId) {
            renderReportFollowUpComparison(auditObj);
        }

        const store = db.stores.find(s => s.id === auditObj.storeId);
        document.getElementById('report-store-name').innerText = store ? store.name : 'Loja Desconhecida';
        
        const typeEl = document.getElementById('report-audit-type');
        if (typeEl) {
            typeEl.innerText = auditObj.type === 'retorno' ? 'AUDITORIA DE RETORNO' : 'AUDITORIA PADRÃO';
            typeEl.style.color = auditObj.type === 'retorno' ? 'var(--warning)' : 'var(--text-body)';
        }
        
        // Dados da Empresa e Logo (Lookup via Store ou Usuário)
        const effectiveCompanyId = store?.companyId || currentUser.companyId;
        if (effectiveCompanyId) {
            const comp = db.companies.find(c => c.id === effectiveCompanyId);
            if (comp) {
                document.getElementById('report-company-name').innerText = comp.name;
                if (comp.logo) {
                    document.getElementById('report-company-logo').innerHTML = `<img src="${comp.logo}" style="max-height: 100%; max-width: 100%; object-fit: contain;">`;
                    document.getElementById('report-company-logo').style.background = 'transparent';
                    document.getElementById('report-company-logo').style.border = 'none';
                    const watermark = document.getElementById('report-watermark');
                    if(watermark) watermark.src = comp.logo;
                } else {
                    // Fallback para ícone se não houver logo
                    document.getElementById('report-company-logo').innerHTML = `<i class="ph ph-buildings" style="font-size: 2.5rem; color: var(--primary);"></i>`;
                }
            }
        }

        // Gerente e Encarregado da Auditoria
        document.getElementById('report-manager').innerText = auditObj.managerName || '-';
        document.getElementById('report-supervisor').innerText = auditObj.supervisorName || '-';
        // Assinaturas fixas não HTML

        const dateObj = new Date(auditObj.date);
        document.getElementById('report-date').innerText = dateObj.toLocaleDateString('pt-BR');
        document.getElementById('report-auditor').innerText = auditObj.auditor;

        // Data de Retorno Obrigatória
        const returnActionContainer = document.getElementById('report-return-action-container');
        if (auditObj.returnDate) {
            let rd = new Date(auditObj.returnDate);
            document.getElementById('report-return-date').innerText = rd.toLocaleDateString('pt-BR');
            if(returnActionContainer) returnActionContainer.classList.remove('hidden');
        } else {
            if(returnActionContainer) returnActionContainer.classList.add('hidden');
        }

        document.getElementById('report-score').innerText = auditObj.percentage + '%';
        
        const cBadge = document.getElementById('report-classification');
        cBadge.innerText = auditObj.classification;
        cBadge.className = 'badge'; // reset
        if(auditObj.classification === 'Excelente') cBadge.classList.add('badge-success');
        else if(auditObj.classification === 'Bom') cBadge.classList.add('badge-info');
        else if(auditObj.classification === 'Regular') cBadge.classList.add('badge-warning');
        else cBadge.classList.add('badge-danger');

        const deptContainer = document.getElementById('report-depts-summary');
        deptContainer.innerHTML = '';
        
        // Mudar o titulo para refletir o novo conteudo
        const pCrit = document.getElementById('report-critical-items');
        if (pCrit && pCrit.previousElementSibling) {
            pCrit.previousElementSibling.innerHTML = '<i class="ph ph-list-checks"></i> Detalhamento da Auditoria por Setor';
            pCrit.previousElementSibling.style.color = 'var(--primary)';
        }
        
        const critContainer = document.getElementById('report-critical-items');
        critContainer.innerHTML = '';

        auditObj.departments.forEach(d => {
            const dName = db.departments.find(x => x.id === d.deptId)?.name || 'Depto';
            
            // Dept Progress Bar
            let color = '#34d399';
            if(d.percentage < 50) color = '#ef4444';
            else if(d.percentage < 70) color = '#f59e0b';
            else if(d.percentage < 100) color = '#60a5fa';

            deptContainer.innerHTML += `
                <div style="border: 1px solid var(--border); padding: 12px; border-radius: 8px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
                        <span style="font-weight:700;">${dName} </span>
                        <span style="font-weight:600;">${d.percentage}%</span>
                    </div>
                    <p style="font-size: 0.8rem; color: var(--text-body); margin-bottom: 10px;">Responsável pelo Setor: <span style="font-weight:600;">${d.responsible || 'N/A'}</span></p>
                    <div class="progress-wrap">
                        <div class="progress-fill" style="width: ${d.percentage}%; background:${color}"></div>
                    </div>
                </div>
            `;

            // Detalhamento por Categoria e Itens
            let deptDetailHtml = `
            <div class="report-department-block" style="margin-top: 24px; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: #fff;">
                <div style="background: var(--primary-dept-bg); padding: 12px 16px; border-bottom: 1px solid var(--border);">
                    <h4 style="margin: 0; color: var(--primary); display: flex; justify-content: space-between; align-items:center;">
                        <span><i class="ph ph-storefront"></i> ${dName}</span>
                        <span style="font-size: 1.2rem;">${d.percentage}%</span>
                    </h4>
                </div>
                <div style="padding: 16px; display: flex; flex-direction: column; gap: 20px;">
            `;

            // Group responses by category
            const catsMap = {};
            d.responses.forEach(r => {
                if (!catsMap[r.catId]) catsMap[r.catId] = [];
                catsMap[r.catId].push(r);
            });

            for (const catId in catsMap) {
                const cName = db.categories.find(x => x.id === catId)?.name || 'Categoria';
                deptDetailHtml += `
                    <div>
                        <h5 style="margin-bottom: 12px; padding-bottom: 4px; border-bottom: 1px solid #eee; color: #444; font-size: 1.05rem;">${cName}</h5>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                `;

                catsMap[catId].forEach(r => {
                    const iObj = db.checklistItems.find(x => x.id === r.itemId);
                    
                    let badgeClass = 'badge-success';
                    let valLabel = r.value.toUpperCase();
                    let borderLeftColor = '#10b981';
                    
                    if (r.value === 'ruim') { 
                        badgeClass = 'badge-danger'; 
                        borderLeftColor = '#ef4444';
                    } else if (r.value === 'insuficiente') { 
                        badgeClass = 'badge-warning'; 
                        borderLeftColor = '#f59e0b';
                    } else if (r.value === 'bom') { 
                        badgeClass = 'badge-info'; 
                        borderLeftColor = '#3b82f6';
                    }

                    let photoHtml = '';
                    if (r.photos && r.photos.length > 0) {
                        photoHtml = `<div style="margin-top: 16px; width: 100%; text-align: center;"><img src="${r.photos[0]}" style="max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 2px 8px rgba(0,0,0,0.05);"></div>`;
                    }

                    deptDetailHtml += `
                        <div class="report-no-break" style="padding: 12px; background: #f9f9f9; border-radius: 6px; border-left: 4px solid ${borderLeftColor}; display:flex; flex-direction:column;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
                                <p style="font-size: 0.95rem; font-weight: 500; color: #111; margin:0; flex:1;">${iObj ? iObj.question : "Questão"}</p>
                                <span class="badge ${badgeClass}" style="flex-shrink: 0;">${valLabel}</span>
                            </div>
                            ${r.observations ? `<p style="font-size: 0.85rem; color: #555; margin-top: 8px; font-style: italic;"><span style="font-weight:bold;">Obs:</span> ${r.observations}</p>` : ''}
                            ${photoHtml}
                        </div>
                    `;
                });

                deptDetailHtml += `</div></div>`;
            }

            deptDetailHtml += `</div></div>`;
            critContainer.innerHTML += deptDetailHtml;
        });

        if(auditObj.departments.length === 0) {
            critContainer.innerHTML = '<p style="color:var(--text-muted);">Nenhum checklist auditado.</p>';
        }
    }

    function renderReportFollowUpComparison(auditObj) {
        const container = document.getElementById('report-followup-comparison');
        const followUpContainer = document.getElementById('report-followup-container');
        if (!container || !followUpContainer) return;

        followUpContainer.classList.remove('hidden');
        const parentAudit = db.audits.find(a => a.id === auditObj.parentAuditId);
        if (!parentAudit) return;

        const scoreValues = { 'excelente': 100, 'bom': 80, 'regular': 60, 'ruim': 30, 'insuficiente': 0 };

        auditObj.departments.forEach(dept => {
            const parentDept = parentAudit.departments.find(pd => pd.deptId === dept.deptId);
            if (!parentDept) return;

            const deptName = db.departments.find(x => x.id === dept.deptId)?.name || 'Depto';
            
            dept.responses.forEach(resp => {
                const parentResp = parentDept.responses.find(pr => pr.itemId === resp.itemId);
                if (!parentResp) return;

                const scoreBefore = scoreValues[parentResp.value] || 0;
                const scoreNow = scoreValues[resp.value] || 0;
                
                let evolutionLabel = '';
                let evolutionColor = '';
                
                if (scoreNow > scoreBefore) {
                    evolutionLabel = 'MELHOROU <i class="ph ph-trend-up"></i>';
                    evolutionColor = '#10b981';
                } else if (scoreNow < scoreBefore) {
                    evolutionLabel = 'PIOROU <i class="ph ph-trend-down"></i>';
                    evolutionColor = '#ef4444';
                } else {
                    // Se não mudou, mas era ruim, ainda mostramos como "Mantido"
                    if (scoreNow < 60) {
                        evolutionLabel = 'MANTIDO SEM MELHORA <i class="ph ph-equals"></i>';
                        evolutionColor = '#f59e0b';
                    } else {
                        return; // Se era bom e continuou bom, não precisa poluir o confronto
                    }
                }

                const item = db.checklistItems.find(i => i.id === resp.itemId);
                
                let borderLeftBefore = '#10b981';
                if (parentResp.value === 'ruim') borderLeftBefore = '#ef4444';
                else if (parentResp.value === 'insuficiente') borderLeftBefore = '#f59e0b';
                else if (parentResp.value === 'bom') borderLeftBefore = '#3b82f6';
                
                let borderLeftNow = '#10b981';
                if (resp.value === 'ruim') borderLeftNow = '#ef4444';
                else if (resp.value === 'insuficiente') borderLeftNow = '#f59e0b';
                else if (resp.value === 'bom') borderLeftNow = '#3b82f6';
                
                const row = document.createElement('div');
                row.style = `border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background: #ffffff; position: relative; overflow: hidden;`;
                
                row.innerHTML = `
                    <div style="position: absolute; right: 20px; top: 20px; font-weight: 800; font-size: 0.7rem; color: ${evolutionColor}; border: 1px solid ${evolutionColor}; padding: 4px 8px; border-radius: 4px;">
                        ${evolutionLabel}
                    </div>
                    <p style="font-weight: 600; margin-bottom: 12px; padding-right: 100px; color: #1e293b;">${item ? item.question : 'Item'}</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid ${borderLeftBefore}; padding: 12px; border-radius: 8px;">
                            <p style="font-size: 0.75rem; color: #475569; font-weight: 600; text-transform: uppercase; margin-bottom: 10px;">Antes (Audit. Anterior)</p>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span class="badge ${parentResp.value === 'ruim' || parentResp.value === 'insuficiente' ? 'badge-danger' : 'badge-warning'}">${parentResp.value.toUpperCase()}</span>
                                ${parentResp.photos && parentResp.photos[0] ? `<div style="margin-top: 12px; text-align: center;"><img src="${parentResp.photos[0]}" style="max-width: 100%; max-height: 250px; border-radius: 6px; object-fit: contain; border: 1px solid #cbd5e1;"></div>` : ''}
                            </div>
                            <p style="font-size: 0.85rem; color: #1e293b; margin-top:10px; line-height: 1.4;"><i>"${parentResp.observations || 'Sem obs'}"</i></p>
                        </div>
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid ${borderLeftNow}; padding: 12px; border-radius: 8px;">
                            <p style="font-size: 0.75rem; color: #475569; font-weight: 600; text-transform: uppercase; margin-bottom: 10px;">Agora (Auditoria de Retorno)</p>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span class="badge ${scoreNow >= 80 ? 'badge-success' : (scoreNow >= 60 ? 'badge-warning' : 'badge-danger')}">${resp.value.toUpperCase()}</span>
                                ${resp.photos && resp.photos[0] ? `<div style="margin-top: 12px; text-align: center;"><img src="${resp.photos[0]}" style="max-width: 100%; max-height: 250px; border-radius: 6px; object-fit: contain; border: 1px solid #cbd5e1;"></div>` : ''}
                            </div>
                            <p style="font-size: 0.85rem; color: #1e293b; margin-top:10px; line-height: 1.4;"><i>"${resp.observations || 'Sem obs'}"</i></p>
                        </div>
                    </div>
                `;
                container.appendChild(row);
            });
        });
    }

    document.getElementById('btn-back-report').addEventListener('click', () => {
        document.getElementById('report-view').classList.add('hidden');
        document.body.classList.remove('viewing-report');
        document.getElementById('dashboard-view').classList.remove('hidden');
        document.querySelector('.nav-btn[data-target="dashboard-view"]').click();
    });

    // ==========================================
    // HISTORY MODULE
    // ==========================================


    window.viewReportModal = function(auditId) {
        const aud = db.audits.find(a => a.id === auditId);
        if(aud) {
            showReport(aud);
            setTimeout(() => {
                window.print();
            }, 800);
        }
    };

    // ==========================================
    // DASHBOARD & CHARTS
    // ==========================================
    let dashChartEvo = null;
    let dashChartDept = null;

    function renderDashboard() {
        // Initialize default dates if empty
        const dsInput = document.getElementById('dash-date-start');
        const deInput = document.getElementById('dash-date-end');
        if (!dsInput.value) {
            const lastMonth = new Date();
            lastMonth.setDate(lastMonth.getDate() - 30);
            dsInput.value = lastMonth.toISOString().split('T')[0];
        }
        if (!deInput.value) {
            deInput.value = new Date().toISOString().split('T')[0];
        }

        const storeFilter = document.getElementById('dash-store-filter').value;
        const dateStart = dsInput.value;
        const dateEnd = deInput.value;

        let filteredAudits = db.audits;

        if (storeFilter !== 'all') {
            filteredAudits = filteredAudits.filter(a => a.storeId === storeFilter);
        }

        if (dateStart) {
            const start = new Date(dateStart + 'T00:00:00');
            filteredAudits = filteredAudits.filter(a => new Date(a.date) >= start);
        }

        if (dateEnd) {
            const end = new Date(dateEnd + 'T23:59:59');
            filteredAudits = filteredAudits.filter(a => new Date(a.date) <= end);
        }

        // Filter by the current user's auditor name if NOT admin
        const curUser = JSON.parse(localStorage.getItem('auditai_user'));
        if (curUser && curUser.role !== 'admin') {
            filteredAudits = filteredAudits.filter(a => a.auditor === curUser.name);
        }

        // KPI calculations
        document.getElementById('kpi-total-audits').innerText = filteredAudits.length;
        
        let uniqueStores = new Set(filteredAudits.map(a => a.storeId)).size;
        document.getElementById('kpi-stores-audited').innerText = uniqueStores;

        let tScore = 0;
        let cIssues = 0;

        filteredAudits.forEach(a => {
            tScore += a.percentage;
            a.departments.forEach(d => {
                cIssues += d.responses.filter(r => r.value === 'ruim').length;
            });
        });

        const avgScore = filteredAudits.length > 0 ? Math.round(tScore / filteredAudits.length) : 0;
        document.getElementById('kpi-avg-score').innerText = avgScore + '%';
        document.getElementById('kpi-critical-issues').innerText = cIssues;
        document.getElementById('gauge-score').innerText = avgScore + '%';

        renderCharts(filteredAudits, storeFilter);
        renderRanking(filteredAudits);
        renderClassificationChart(filteredAudits);
        populateDashboardStores();
    }

    function populateDashboardStores() {
        const storeFilter = document.getElementById('dash-store-filter');
        if (!storeFilter) return;
        
        const currentVal = storeFilter.value;
        storeFilter.innerHTML = '<option value="all">Todas as Lojas</option>';
        
        db.stores.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            storeFilter.appendChild(opt);
        });
        
        if (currentVal && Array.from(storeFilter.options).some(o => o.value === currentVal)) {
            storeFilter.value = currentVal;
        }
    }

    let dashChartClass = null;
    function renderClassificationChart(audits) {
        const ctxClass = document.getElementById('chart-classification');
        if(dashChartClass) dashChartClass.destroy();
        if(!ctxClass) return;

        const counts = { 'Excelente': 0, 'Bom': 0, 'Regular': 0, 'Insuficiente': 0 };
        audits.forEach(a => {
            const rating = a.percentage >= 90 ? 'Excelente' : (a.percentage >= 80 ? 'Bom' : (a.percentage >= 60 ? 'Regular' : 'Insuficiente'));
            counts[rating]++;
        });

        dashChartClass = new Chart(ctxClass, {
            type: 'doughnut',
            data: {
                labels: Object.keys(counts),
                datasets: [{
                    data: Object.values(counts),
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                cutout: '70%',
                plugins: { legend: { display: false } }
            }
        });
    }

    let dashChartRanking = null;

    function renderRanking(audits) {
        const storesData = {};
        db.stores.forEach(s => {
            const storeAudits = audits.filter(a => a.storeId === s.id);
            if (storeAudits.length > 0) {
                const avg = storeAudits.reduce((acc, curr) => acc + curr.percentage, 0) / storeAudits.length;
                storesData[s.name] = {
                    score: Math.round(avg),
                    count: storeAudits.length
                };
            }
        });

        const sortedStores = Object.entries(storesData)
            .sort((a, b) => b[1].score - a[1].score);

        const labels = sortedStores.map(s => s[0]);
        const data = sortedStores.map(s => s[1].score);
        const colors = data.map(v => v >= 80 ? '#10b981' : (v >= 60 ? '#f59e0b' : '#ef4444'));

        const ctxRanking = document.getElementById('chart-ranking');
        if (dashChartRanking) dashChartRanking.destroy();
        
        if (ctxRanking) {
            dashChartRanking = new Chart(ctxRanking, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Performance Média (%)',
                        data: data,
                        backgroundColor: colors,
                        borderRadius: 6
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { x: { min: 0, max: 100 } },
                    plugins: { legend: { display: false } }
                }
            });
        }

        const tbody = document.getElementById('dash-ranking-table-body');
        if (tbody) {
            tbody.innerHTML = sortedStores.map((s, i) => `
                <tr>
                    <td><span class="badge ${i < 3 ? 'badge-success' : 'badge-ghost'}">${i + 1}º</span></td>
                    <td><strong>${s[0]}</strong></td>
                    <td style="font-weight: 600; color: ${s[1].score >= 80 ? 'var(--success)' : (s[1].score >= 60 ? 'var(--warning)' : 'var(--danger)')}">${s[1].score}%</td>
                </tr>
            `).join('');
        }
    }

    function renderCharts(audits, storeFilter) {
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.font.family = "'Inter', sans-serif";

        const ctxEvo = document.getElementById('chart-evolution');
        if(dashChartEvo) dashChartEvo.destroy();

        if (storeFilter !== 'all') {
            // Aggregate by date for the same store if multiple audits in same day
            const dailyData = {};
            audits.forEach(a => {
                const d = new Date(a.date).toLocaleDateString('pt-BR');
                if(!dailyData[d]) dailyData[d] = { total: 0, count: 0 };
                dailyData[d].total += a.percentage;
                dailyData[d].count++;
            });

            const sortedDates = Object.keys(dailyData).sort((a,b) => {
                const [d1, m1, y1] = a.split('/');
                const [d2, m2, y2] = b.split('/');
                return new Date(y1, m1-1, d1) - new Date(y2, m2-1, d2);
            });

            const scores = sortedDates.map(d => Math.round(dailyData[d].total / dailyData[d].count));

            dashChartEvo = new Chart(ctxEvo, {
                type: 'line',
                data: {
                    labels: sortedDates,
                    datasets: [{
                        label: 'Performance',
                        data: scores,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true, tension: 0.4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 100 } } }
            });
        } else {
            // Multi-line evolution - Aggregate by store AND date
            const allDatesSet = new Set();
            const storeSeries = {};

            db.stores.forEach(s => {
                storeSeries[s.id] = {};
            });

            audits.forEach(a => {
                const d = new Date(a.date).toLocaleDateString('pt-BR');
                allDatesSet.add(d);
                if(!storeSeries[a.storeId][d]) storeSeries[a.storeId][d] = { total: 0, count: 0 };
                storeSeries[a.storeId][d].total += a.percentage;
                storeSeries[a.storeId][d].count++;
            });

            const allDates = [...allDatesSet].sort((a,b) => {
                const [d1, m1, y1] = a.split('/');
                const [d2, m2, y2] = b.split('/');
                return new Date(y1, m1-1, d1) - new Date(y2, m2-1, d2);
            });

            const datasets = [];
            db.stores.forEach((s, idx) => {
                const data = allDates.map(d => {
                    const entry = storeSeries[s.id][d];
                    return entry ? Math.round(entry.total / entry.count) : null;
                });

                if (data.some(v => v !== null)) {
                    datasets.push({
                        label: s.name,
                        data: data,
                        borderColor: `hsl(${idx * 137.5}, 70%, 50%)`,
                        spanGaps: true,
                        tension: 0.4,
                        fill: false
                    });
                }
            });

            dashChartEvo = new Chart(ctxEvo, {
                type: 'line',
                data: { labels: allDates, datasets: datasets },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    scales: { y: { min: 0, max: 100 } },
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } }
                }
            });
        }

        // Dept performance
        const ctxDept = document.getElementById('chart-departments');
        if(dashChartDept) dashChartDept.destroy();
        
        const deptsData = {};
        db.departments.forEach(d => deptsData[d.name] = { t: 0, c: 0 });
        
        audits.forEach(a => {
            a.departments.forEach(ad => {
                const dName = db.departments.find(x => x.id === ad.deptId)?.name;
                if(dName) {
                    deptsData[dName].t += ad.percentage;
                    deptsData[dName].c++;
                }
            });
        });

        const deptLabels = Object.keys(deptsData);
        const deptScores = deptLabels.map(l => deptsData[l].c > 0 ? Math.round(deptsData[l].t / deptsData[l].c) : 0);

        dashChartDept = new Chart(ctxDept, {
            type: 'bar',
            data: {
                labels: deptLabels,
                datasets: [{
                    label: 'Performance Média (%)',
                    data: deptScores,
                    backgroundColor: 'rgba(239, 68, 68, 0.6)',
                    borderRadius: 4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 100 } } }
        });
    }

        function renderAuditHistory() {
        const tbody = document.getElementById('audits-table-body');
        if(!tbody) return;
        tbody.innerHTML = '';
        
        const audits = db.audits.sort((a,b) => new Date(b.date) - new Date(a.date));
        
        if (audits.length === 0) {
            tbody.innerHTML = '<tr><td colspan=""6"" style=""text-align:center; padding: 20px; color: var(--text-muted);"">Nenhuma auditoria encontrada.</td></tr>';
            return;
        }

        audits.forEach(aud => {
            const store = db.stores.find(s => s.id === aud.storeId);
            const storeName = store ? store.name : 'Loja Desconhecida';
            const dateStr = new Date(aud.date).toLocaleDateString('pt-BR') + ' ' + new Date(aud.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            
            const badgeClass = aud.percentage >= 80 ? 'badge-success' : (aud.percentage >= 60 ? 'badge-warning' : 'badge-danger');
            let rating = 'Bom';
            if(aud.percentage < 60) rating = 'Insuficiente';
            if(aud.percentage >= 90) rating = 'Excelente';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${dateStr}</td>
                <td><strong>${storeName}</strong><br><small style="color:var(--text-muted);">${aud.type === 'padrao' ? 'Padrão' : 'Retornão'}</small></td>
                <td>${aud.auditor || '-'}</td>
                <td><span class="badge ${badgeClass}">${aud.percentage}%</span></td>
                <td>${rating}</td>
                <td style="display:flex; gap:8px;">
                    <button class="btn btn-outline btn-sm" onclick="viewReportModal('${aud.id}')">
                        <i class="ph ph-printer"></i> Imprimir/Ver
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="window.deleteAudit('${aud.id}')" title="Excluir Auditoria">
                        <i class="ph ph-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.deleteAudit = function(id) {
        if (!confirm('Tem certeza que deseja excluir esta auditoria? Esta ação não pode ser desfeita.')) return;
        db.audits = db.audits.filter(a => a.id !== id);
        saveDB();
        renderAuditHistory();
        if (typeof renderDashboard === 'function') renderDashboard();
    };

    // Attach to history nav
    const historyBtn = document.querySelector('.nav-btn[data-target="audits-list-view"]');
    if(historyBtn) {
        historyBtn.addEventListener('click', renderAuditHistory);
    }

    // Call render dashboard when switching to it
    document.getElementById('nav-dashboard').addEventListener('click', renderDashboard);
    
    document.getElementById('btn-apply-dash-filters').addEventListener('click', renderDashboard);

    // ==========================================
    // ADMIN MODULE
    // ==========================================
    function renderAdminUsers() {
        const tbody = document.getElementById('admin-users-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        db.users.forEach(u => {
            const tr = document.createElement('tr');
            const roleMap = { 'admin': 'Administrador', 'manager': 'Gerente', 'auditor': 'Auditor', 'none': 'Sem Perfil' };
            const roleName = roleMap[u.role] || u.role;
            const statusBadge = u.status === 'aprovado' ? '<span class="badge badge-success">Aprovado</span>' : '<span class="badge badge-warning">Pendente</span>';
            
            const companyName = (u.companyId && db.companies) ? (db.companies.find(c => c.id === u.companyId)?.name || 'N/A') : 'Nenhuma empresa vinculada';
            
            const btnApprove = u.status === 'pendente' ? `<button class="btn btn-primary" style="padding:4px 8px; font-size:0.75rem;" onclick='window.showApproveUserModal("${u.id}")'>Vincular</button>` : '';

            tr.innerHTML = `
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${roleName} <br><small style="color:var(--text-muted);">${companyName}</small></td>
                <td>${statusBadge}</td>
                <td>${btnApprove}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    const modalApprove = document.getElementById('modal-approve-user');
    const selectCompany = document.getElementById('approve-company');

    window.showApproveUserModal = function(userId) {
        document.getElementById('approve-user-id').value = userId;
        selectCompany.innerHTML = '<option value="">Sem empresa</option>';
        if (db.companies) {
            db.companies.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = c.name;
                selectCompany.appendChild(opt);
            });
        }
        modalApprove.classList.remove('hidden');
    };

    const btnCancelApprove = document.getElementById('btn-cancel-approve');
    if(btnCancelApprove) {
        btnCancelApprove.addEventListener('click', () => {
            modalApprove.classList.add('hidden');
        });
    }

    const btnConfirmApprove = document.getElementById('btn-confirm-approve');
    if(btnConfirmApprove) {
        btnConfirmApprove.addEventListener('click', () => {
            const userId = document.getElementById('approve-user-id').value;
            const role = document.getElementById('approve-role').value;
            const compId = document.getElementById('approve-company').value;

            const u = db.users.find(x => x.id === userId);
            if(u) {
                u.status = 'aprovado';
                u.role = role;
                u.companyId = compId || null;
                saveDB();
                renderAdminUsers();
                modalApprove.classList.add('hidden');
            }
        });
    }

    function renderAdminStores() {
        const tbody = document.getElementById('admin-stores-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        db.stores.forEach(s => {
            const tr = document.createElement('tr');
            
            // Associar Ã  Matriz (Empresa)
            let companyName = "Desconhecida";
            if (s.companyId && db.companies) {
                const comp = db.companies.find(c => c.id === s.companyId);
                if (comp) companyName = comp.name;
            }
            // Fallback for default stores
            if (!s.companyId) companyName = "Sem matriz vinculada";

            tr.innerHTML = `
                <td><span class="badge ${s.companyId ? 'badge-info' : 'badge-warning'}">${companyName}</span></td>
                <td>${s.code}</td>
                <td><b>${s.name}</b></td>
                <td>${s.city}</td>
                <td>
                    <button class="btn btn-ghost" onclick='alert("Editar lojá (Em breve)")'><i class="ph ph-pencil-simple"></i></button>
                    <button class="btn btn-ghost" style="color:var(--danger);" onclick=\'window.deleteStore("${s.id}")\'><i class="ph ph-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Formulário de Nova Filial
    const btnAddStoreShow = document.getElementById('btn-add-store-show');
    const storeFormContainer = document.getElementById('admin-store-form-container');
    const storeForm = document.getElementById('admin-store-form');
    const btnCancelStore = document.getElementById('btn-cancel-store');
    const storeCompanySelect = document.getElementById('store-company-id');

    
    const storeManagerSelect = document.getElementById('store-manager-id');
    const storeManagerName = document.getElementById('store-manager-name');
    if (storeManagerSelect) {
        storeManagerSelect.addEventListener('change', () => {
            const userId = storeManagerSelect.value;
            const u = db.users.find(x => x.id === userId);
            storeManagerName.value = u ? u.name : '';
        });
    }

    if (btnAddStoreShow) {
        btnAddStoreShow.addEventListener('click', () => {
            storeFormContainer.classList.remove('hidden');
            btnAddStoreShow.classList.add('hidden');
            
            // Popular select de empresas
            storeCompanySelect.innerHTML = '<option value="" disabled selected>Selecione a empresa</option>';
            if (db.companies) {
                db.companies.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = c.name;
                    storeCompanySelect.appendChild(opt);
                });
            }

            // Popular select de gerentes (users array filter by role manager)
            storeManagerSelect.innerHTML = '<option value="">Selecione um gerente...</option>';
            db.users.filter(u => u.role === 'manager' || u.role === 'admin').forEach(u => {
                 const opt = document.createElement('option');
                 opt.value = u.id;
                 opt.textContent = u.name + ' (' + u.email + ')';
                 storeManagerSelect.appendChild(opt);
            });
            storeManagerName.value = '';
        });
    }

    if (btnCancelStore) {
        btnCancelStore.addEventListener('click', () => {
            storeFormContainer.classList.add('hidden');
            btnAddStoreShow.classList.remove('hidden');
            storeForm.reset();
        });
    }

    if (storeForm) {
        storeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const companyId = document.getElementById('store-company-id').value;
            const code = document.getElementById('store-code').value;
            const name = document.getElementById('store-name').value;
            const cnpj = document.getElementById('store-cnpj').value;
            const dateInauguration = document.getElementById('store-date-inauguration').value;
            const city = document.getElementById('store-city').value;
            const address = document.getElementById('store-address').value;
            const managerId = document.getElementById('store-manager-id').value;
            const managerName = document.getElementById('store-manager-name').value;
            const phone = document.getElementById('store-phone').value;
            const email = document.getElementById('store-email').value;

            if (!db.stores) db.stores = [];
            db.stores.push({
                id: 's_' + Date.now(),
                companyId, code, name, cnpj, dateInauguration, city, address, managerId, managerName, phone, email
            });

            saveDB();
            storeForm.reset();
            storeFormContainer.classList.add('hidden');
            btnAddStoreShow.classList.remove('hidden');
            renderAdminStores();
            // Need to update stores in dashboard too
            if (typeof populateStores === 'function') populateStores();
        });
    }

    document.getElementById('nav-admin').addEventListener('click', () => {
        renderAdminUsers();
        renderAdminStores();
    });

    // Admin Tabs Logic
    document.querySelectorAll('#admin-view .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#admin-view .tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('#admin-view .tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Dashboard Tabs Logic
    document.querySelectorAll('#dashboard-view .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#dashboard-view .tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('#dashboard-view .tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });



// ==========================================
// CRUDS - ADMIN (Empresas, Depts, Checklists)
// ==========================================

window.renderAdminCompanies = function () {
    const tbody = document.getElementById('admin-companies-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    let companies = db.companies || [];

    if (companies.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Nenhuma empresa cadastrada.</td></tr>';
    }

    companies.forEach(c => {
        const tr = document.createElement('tr');
        
        const logoImg = c.logo ? `<img src="${c.logo}" alt="Logo" style="max-height: 30px; max-width: 80px; object-fit: contain;">` : '<div style="width:30px; height:30px; background:var(--border); border-radius:4px;"></div>';
        
        const loc = [c.city, c.address].filter(Boolean).join('<br><span style="font-size:0.8rem; color:var(--text-muted);">') + (c.address ? '</span>' : '');
        
        const contact = [c.phone, c.email].filter(Boolean).join('<br><span style="font-size:0.8rem; color:var(--text-muted);">') + (c.email ? '</span>' : '');

        const colorsHtml = c.colors ? `
            <div style="display:flex; gap:4px; margin-top:4px;">
                <div style="width:12px; height:12px; background:${c.colors.primary}; border-radius:2px;"></div>
                <div style="width:12px; height:12px; background:${c.colors.secondary}; border-radius:2px;"></div>
                <div style="width:12px; height:12px; background:${c.colors.accent}; border-radius:2px;"></div>
            </div>
        ` : '';

        tr.innerHTML = `
            <td>${logoImg}</td>
            <td>
                <div style="font-weight: 500;">${c.name}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${c.social || ''}</div>
                ${colorsHtml}
            </td>
            <td>${c.cnpj}</td>
            <td>${loc}</td>
            <td>${contact}</td>
            <td><span class="badge badge-success">${c.status || 'Ativo'}</span></td>
            <td>
                <button class="btn btn-ghost" onclick='window.editCompany("${c.id}")'><i class="ph ph-pencil-simple"></i></button>
                <button class="btn btn-ghost" style="color:var(--danger);" onclick='window.deleteCompany("${c.id}")'><i class="ph ph-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

const btnAddCompanyShow = document.getElementById('btn-add-company-show');
const btnCancelCompany = document.getElementById('btn-cancel-company');
const companyFormContainer = document.getElementById('admin-company-form-container');
const companyForm = document.getElementById('admin-company-form');

if (btnAddCompanyShow) {
    btnAddCompanyShow.addEventListener('click', () => {
        companyFormContainer.classList.remove('hidden');
        btnAddCompanyShow.classList.add('hidden');
    });
}

if (btnCancelCompany) {
    btnCancelCompany.addEventListener('click', () => {
        companyFormContainer.classList.add('hidden');
        btnAddCompanyShow.classList.remove('hidden');
        companyForm.reset();
        document.getElementById('comp-logo-data').value = '';
    });
}

const logoInput = document.getElementById('comp-logo-input');
if (logoInput) {
    logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('comp-logo-data').value = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

if (companyForm) {
    companyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('comp-name').value;
        const social = document.getElementById('comp-social').value;
        const cnpj = document.getElementById('comp-cnpj').value;
        const city = document.getElementById('comp-city').value;
        const address = document.getElementById('comp-address').value;
        const phone = document.getElementById('comp-phone').value;
        const email = document.getElementById('comp-email').value;
        const colorPrimary = document.getElementById('comp-color-primary').value;
        const colorSecondary = document.getElementById('comp-color-secondary').value;
        const colorAccent = document.getElementById('comp-color-accent').value;
        const logo = document.getElementById('comp-logo-data').value;
        
        if (!db.companies) db.companies = [];
        
        db.companies.push({
            id: 'comp_' + Date.now(),
            name, social, cnpj, city, address, phone, email,
            colors: { primary: colorPrimary, secondary: colorSecondary, accent: colorAccent },
            logo,
            status: 'Ativo'
        });
        
        saveDB();
        companyForm.reset();
        document.getElementById('comp-logo-data').value = '';
        companyFormContainer.classList.add('hidden');
        btnAddCompanyShow.classList.remove('hidden');
        renderAdminCompanies();
    });
}


window.renderAdminCategories = function () {
    const tbody = document.getElementById('admin-categories-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (!db.categories) db.categories = [];
    
    document.getElementById('categories-count').innerText = db.categories.length;

    db.categories.sort((a,b) => a.weight - b.weight).forEach(c => {
        const tr = document.createElement('tr');
        const deptName = db.departments.find(d => d.id === c.dept_id)?.name || 'Nenhum';
        
        tr.innerHTML = `
            <td>${c.weight || 0}</td>
            <td><b>${c.name}</b></td>
            <td>${deptName}</td>
            <td>${c.weight_value || '1.0'}</td>
            <td><span class="badge badge-success">${c.status || 'Ativo'}</span></td>
            <td>
                <button class="btn btn-ghost" onclick='window.editCategory("${c.id}")'><i class="ph ph-pencil-simple"></i></button>
                <button class="btn btn-ghost" style="color:var(--danger);" onclick='window.deleteCategory("${c.id}")'><i class="ph ph-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Lógica do Form de Nova Categoria
const categoryForm = document.getElementById('category-item-form');
const catDeptSelect = document.getElementById('cat-dept-id');

window.populateCategoryForm = function() {
    if (!catDeptSelect) return;
    
    catDeptSelect.innerHTML = '<option value="">Selecione...</option>';
    db.departments.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = d.name;
        catDeptSelect.appendChild(opt);
    });
};

if (categoryForm) {
    categoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('cat-name').value.trim();
        const deptId = catDeptSelect.value;
        const weightValue = parseFloat(document.getElementById('cat-weight-value').value);
        const order = parseInt(document.getElementById('cat-order').value) || null;
        const isActive = document.getElementById('cat-is-active').checked;
        
        if (!deptId) {
            alert('Por favor, selecione um departamento.');
            return;
        }

        if (!db.categories) db.categories = [];
        
        db.categories.push({ 
            id: 'cat_' + Date.now(), 
            name: name, 
            dept_id: deptId, 
            weight: order || (db.categories.length + 1), // order property
            weight_value: weightValue,                   // value property
            status: isActive ? 'Ativo' : 'Inativo'
        });
        
        saveDB();
        renderAdminCategories();
        categoryForm.reset();
    });
}


// Devolve um Ícone baseado não nãome ou id, caso nao tenha um cadastrado
function getDeptIcon(deptName) {
    if(!deptName) return "ph-buildings";
    deptName = String(deptName);
    const n = deptName.toLowerCase();
    if(n.includes('açougue') || n.includes('acougue') || n.includes('carne')) return 'ph-package'; // placeholder pra carne
    if(n.includes('frios') || n.includes('padaria') || n.includes('laticínios')) return 'ph-package';
    if(n.includes('horti') || n.includes('fruta')) return 'ph-package';
    if(n.includes('venda') || n.includes('frente') || n.includes('caixa')) return 'ph-shopping-cart';
    if(n.includes('depósito') || n.includes('estoque') || n.includes('recebimento')) return 'ph-package';
    if(n.includes('financeiro') || n.includes('rh')) return 'ph-briefcase';
    return 'ph-buildings';
}

window.renderAdminDepts = function () {
    const tbody = document.getElementById('admin-depts-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    db.departments.forEach(d => {
        const iconClass = getDeptIcon(d.name);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align: center;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(16,185,129,0.1); display: inline-flex; align-items: center; justify-content: center; color: var(--primary);">
                    <i class="ph ${iconClass}" style="font-size: 1.2rem;"></i>
                </div>
            </td>
            <td>
                <strong>${d.name}</strong>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top:4px;">Peso: ${d.weight || 10}%</div>
            </td>
            <td>
                <button class="btn btn-ghost" onclick='window.editDept("${d.id}")'><i class="ph ph-pencil-simple"></i></button>
                <button class="btn btn-ghost" style="color:var(--danger);" onclick='window.deleteDept("${d.id}")'><i class="ph ph-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

const btnAddDept = document.getElementById('btn-add-dept');
if (btnAddDept) {
    btnAddDept.addEventListener('click', () => {
        const name = prompt("Nome do Novo Departamento:");
        if (name) {
            db.departments.push({ id: 'd_' + Date.now(), name: name, weight: 1 });
            saveDB();
            renderAdminDepts();
        }
    });
}

window.renderAdminChecklists = function () {
    const tbody = document.getElementById('admin-checklist-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (db.checklistItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Nenhum item cadastrado.</td></tr>';
        return;
    }

    // Group by dept
    const grouped = {};
    db.checklistItems.forEach(i => {
        const deptId = i.dept_id || 'none';
        if (!grouped[deptId]) grouped[deptId] = [];
        grouped[deptId].push(i);
    });

    Object.keys(grouped).forEach(deptId => {
        const dept = db.departments.find(d => d.id === deptId);
        const deptName = dept ? dept.name : 'Sem departamento';

        // Header row for department
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `<td colspan="6" style="background:rgba(239, 68, 68, 0.1); font-weight:600; color:var(--primary); padding:8px 12px; border-radius:6px;">${deptName} (${grouped[deptId].length} itens)</td>`;
        tbody.appendChild(headerRow);

        grouped[deptId].forEach(i => {
            const tr = document.createElement('tr');
            const cat = db.categories.find(c => c.id === i.cat_id);
            const catName = cat ? cat.name : 'Sem categoria';
            tr.innerHTML = `
                <td>${i.question}</td>
                <td>${deptName}</td>
                <td>${catName}</td>
                <td>${i.order || '-'}</td>
                <td><span class="badge ${i.eh_critico ? 'badge-danger' : 'badge-success'}">${i.eh_critico ? 'Crítico' : 'Normal'}</span></td>
                <td>
                    <button class="btn btn-ghost" onclick='window.editChecklist("${i.id}")'><i class="ph ph-pencil-simple"></i></button>
                    <button class="btn btn-ghost" style="color:var(--danger);" onclick='window.deleteChecklist("${i.id}")'><i class="ph ph-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
}

// Lógica do Novo Formulário de Checklist
const checklistForm = document.getElementById('checklist-item-form');
const clDeptSelect = document.getElementById('cl-dept-id');
const clCatSelect = document.getElementById('cl-cat-id');

window.populateChecklistForm = function() {
    if (!clDeptSelect) return;
    
    // Popular departamentos
    clDeptSelect.innerHTML = '<option value="">Selecione...</option>';
    db.departments.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = d.name;
        clDeptSelect.appendChild(opt);
    });
    
    // Reset e disable categorias
    if (clCatSelect) {
        clCatSelect.innerHTML = '<option value="">Selecione um departamento primeiro</option>';
        clCatSelect.disabled = true;
    }
};

if (clDeptSelect && clCatSelect) {
    clDeptSelect.addEventListener('change', (e) => {
        const deptId = e.target.value;
        if (!deptId) {
            clCatSelect.innerHTML = '<option value="">Selecione um departamento primeiro</option>';
            clCatSelect.disabled = true;
            return;
        }
        
        // Filter categories by dept
        const cats = db.categories.filter(c => c.dept_id === deptId);
        clCatSelect.innerHTML = '<option value="">Selecione (opcional)...</option>';
        
        if (cats.length > 0) {
            cats.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = c.name;
                clCatSelect.appendChild(opt);
            });
            clCatSelect.disabled = false;
        } else {
            clCatSelect.innerHTML = '<option value="">Nenhuma categoria cadastrada</option>';
            clCatSelect.disabled = true;
        }
    });
}

if (checklistForm) {
    checklistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const q = document.getElementById('cl-question').value.trim();
        const deptId = clDeptSelect.value;
        const catId = clCatSelect.value;
        const order = parseInt(document.getElementById('cl-order').value) || null;
        const isActive = document.getElementById('cl-is-active').checked;
        const isCritical = document.getElementById('cl-is-critical').checked;
        
        if (!deptId) {
            alert('Selecione um departamento.');
            return;
        }
        
        db.checklistItems.push({
            id: 'i_' + Date.now(),
            dept_id: deptId,
            cat_id: catId || 'none',
            question: q,
            order: order,
            status: isActive ? 'Ativo' : 'Inativo',
            eh_critico: isCritical
        });
        
        saveDB();
        renderAdminChecklists();
        checklistForm.reset();
        
        // Reset category state
        clCatSelect.innerHTML = '<option value="">Selecione um departamento primeiro</option>';
        clCatSelect.disabled = true;
    });
}

// Lógica de Configurações Gerais
const emailConfigForm = document.getElementById('email-config-form');

function renderAdminSettings() {
    if (!db.config) db.config = { emailjs_service: '', emailjs_template: '', emailjs_public_key: '' };
    
    const svc = document.getElementById('cfg-email-service');
    const tmp = document.getElementById('cfg-email-template');
    const pub = document.getElementById('cfg-email-public-key');
    
    if (svc) svc.value = db.config.emailjs_service || '';
    if (tmp) tmp.value = db.config.emailjs_template || '';
    if (pub) pub.value = db.config.emailjs_public_key || '';
}

if (emailConfigForm) {
    emailConfigForm.addEventListener('submit', (e) => {
        e.preventDefault();
        db.config.emailjs_service = document.getElementById('cfg-email-service').value.trim();
        db.config.emailjs_template = document.getElementById('cfg-email-template').value.trim();
        db.config.emailjs_public_key = document.getElementById('cfg-email-public-key').value.trim();
        saveDB();
        alert('Configurações salvas com sucesso!');
    });
}

// Refresh these tables when admin view is clicked
const nAdmin2 = document.getElementById('nav-admin');
if (nAdmin2) {
    nAdmin2.addEventListener('click', () => {
        renderAdminCompanies();
        renderAdminDepts();
        renderAdminChecklists();
        renderAdminCategories();
        renderAdminSettings(); // Adicionado
        if (typeof populateChecklistForm === 'function') populateChecklistForm();
        if (typeof populateCategoryForm === 'function') populateCategoryForm();
    });
}



window.editDept = function(id) {
    const d = db.departments.find(x => x.id === id);
    if (!d) return;
    const newName = prompt('Editar Departamento (Nome):', d.name);
    if (newName && newName.trim()) {
        d.name = newName.trim();
    }
    const newWeight = prompt('Editar Peso (%) do Departamento:\n(O sistema distribuirá automaticamente se a soma não for 100% não próximo load)', d.weight || 10);
    if (newWeight && !isNaN(parseFloat(newWeight))) {
        d.weight = parseFloat(newWeight);
    }
    saveDB();
    renderAdminDepts();
};

window.editChecklist = function(id) {
    const item = db.checklistItems.find(x => x.id === id);
    if (!item) return;

    // Change department?
    const deptList = db.departments.map((d, idx) => (idx+1) + '. ' + d.name).join('\n');
    const currentDept = db.departments.find(d => d.id === item.dept_id);
    const currentDeptNum = currentDept ? db.departments.indexOf(currentDept) + 1 : '';
    const deptChoice = prompt('Departamento deste item (atual: ' + (currentDept ? currentDept.name : 'Sem dept') + '):\n\n' + deptList + '\n\nDigite o NÚMERO ou deixe vazio para não alterar:', currentDeptNum);
    if (deptChoice && deptChoice.trim()) {
        const deptIdx = parseInt(deptChoice.trim()) - 1;
        if (!isNaN(deptIdx) && deptIdx >= 0 && deptIdx < db.departments.length) {
            item.dept_id = db.departments[deptIdx].id;
        }
    }

    const newQ = prompt('Editar Pergunta:', item.question);
    if (newQ && newQ.trim()) {
        item.question = newQ.trim();
    }
    const crit = confirm('Este item é CRÍTICO? (OK = Sim, Cancelar = No)');
    item.eh_critico = crit;
    saveDB();
    renderAdminChecklists();
};

window.editCategory = function(id) {
    const cat = (db.categories || []).find(x => x.id === id);
    if (!cat) return;
    const newName = prompt('Editar Nome da Categoria:', cat.name);
    if (!newName || !newName.trim()) return;
    cat.name = newName.trim();
    const newWeight = prompt('Editar Ordem/Peso:', cat.weight);
    if (newWeight) cat.weight = parseInt(newWeight) || cat.weight;
    const newWeightVal = prompt('Editar Peso (valor decimal):', cat.weight_value);
    if (newWeightVal) cat.weight_value = parseFloat(newWeightVal).toFixed(1) || cat.weight_value;
    saveDB();
    renderAdminCategories();
};

window.editCompany = function(id) {
    const c = (db.companies || []).find(x => x.id === id);
    if (!c) return;
    const newName = prompt('Editar Nome Fantasia:', c.name);
    if (!newName || !newName.trim()) return;
    c.name = newName.trim();
    const newCnpjá = prompt('Editar CNPJ:', c.cnpj);
    if (newCnpjá) c.cnpj = newCnpjá.trim();
    const newCity = prompt('Editar Cidade:', c.city || '');
    if (newCity !== null) c.city = newCity.trim();
    const newPhone = prompt('Editar Telefone:', c.phone || '');
    if (newPhone !== null) c.phone = newPhone.trim();
    const newEmail = prompt('Editar E-mail:', c.email || '');
    if (newEmail !== null) c.email = newEmail.trim();
    saveDB();
    renderAdminCompanies();
};

window.deleteCompany = function(id) {
    if(confirm("Tem certeza que deseja excluir esta empresa? Isso não pode ser desfeito.")) {
        db.companies = db.companies.filter(c => c.id !== id);
        saveDB();
        renderAdminCompanies();
    }
};

window.deleteStore = function(id) {
    if(confirm("Tem certeza que deseja excluir esta filial?")) {
        db.stores = db.stores.filter(s => s.id !== id);
        saveDB();
        renderAdminStores();
        if (typeof populateStores === 'function') populateStores();
    }
};

window.deleteDept = function(id) {
    if(confirm("Tem certeza que deseja excluir este departamento?")) {
        db.departments = db.departments.filter(d => d.id !== id);
        saveDB();
        renderAdminDepts();
    }
};

window.deleteChecklist = function(id) {
    if(confirm("Tem certeza que deseja excluir este item do checklist?")) {
        db.checklistItems = db.checklistItems.filter(i => i.id !== id);
        saveDB();
        renderAdminChecklists();
    }
};


window.deleteCategory = function(id) {
    if(confirm("Tem certeza que deseja excluir esta categoria?")) {
        db.categories = db.categories.filter(c => c.id !== id);
        saveDB();
        renderAdminCategories();
    }
};

// ==========================================
// PHOTO UPLOAD MODULE (DURING AUDIT)
// ==========================================
let currentUploadItemEl = null;

document.getElementById('categories-container').addEventListener('click', (e) => {
    if (e.target.closest('.btn-add-photo')) {
        const btn = e.target.closest('.btn-add-photo');
        currentUploadItemEl = btn.closest('.audit-item');
        document.getElementById('photo-upload-input').click();
    }
});

document.getElementById('photo-upload-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && currentUploadItemEl) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Str = event.target.result;

            // Store base64 in dataset of the item for later retrieval
            const photoDataStorage = currentUploadItemEl.querySelector('.photo-data');
            if (!photoDataStorage) {
                const hiddenData = document.createElement('input');
                hiddenData.type = 'hidden';
                hiddenData.className = 'photo-data';
                currentUploadItemEl.appendChild(hiddenData);
            }
            currentUploadItemEl.querySelector('.photo-data').value = base64Str;

            // Visual feedback
            const btn = currentUploadItemEl.querySelector('.btn-add-photo');
            btn.innerHTML = '<i class="ph ph-check-circle" style="color:var(--success);"></i> Foto Adicionada';
            btn.classList.add('btn-outline');
            btn.classList.remove('btn-ghost');

            currentUploadItemEl = null; // reset
        };
        reader.readAsDataURL(file);
    }
});




function renderScheduledAudits() {
    const tbody = document.getElementById('scheduled-audits-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const scheduledAudits = db.audits.filter(a => a.returnDate && a.type === 'padrao');

    if (scheduledAudits.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 24px; color: var(--text-muted);">Nenhuma auditoria aguardando retorno.</td></tr>';
        return;
    }

    scheduledAudits.sort((a, b) => new Date(a.returnDate).getTime() - new Date(b.returnDate).getTime());

    scheduledAudits.forEach(audit => {
        const childAudit = db.audits.find(child => child.type === 'retorno' && child.parentAuditId === audit.id);
        
        let statusHtml = '';
        let actionHtml = '';
        const todayStr = new Date().toISOString().split('T')[0];
        
        if (childAudit) {
            statusHtml = '<span class="badge badge-success">Resolvido</span>';
            actionHtml = '<button class="btn btn-outline btn-sm" disabled><i class="ph ph-check"></i> Concluído</button>';
        } else {
            if (audit.returnDate < todayStr) {
                statusHtml = '<span class="badge badge-danger">Atrasado</span>';
            } else {
                statusHtml = '<span class="badge badge-warning">Pendente</span>';
            }
            actionHtml = `<button class="btn btn-primary btn-sm btn-do-followup" data-id="${audit.id}"><i class="ph ph-arrow-counter-clockwise"></i> Realizar Retorno</button>`;
        }
        
        const store = db.stores.find(s => s.id === audit.storeId);
        const storeName = store ? store.name : 'Loja Desconhecida';
        
        let rdDateStr = audit.returnDate;
        try {
            // "yyyy-mm-dd" to "dd/mm/yyyy"
            const parts = audit.returnDate.split('-');
            if(parts.length === 3) rdDateStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
        } catch(e) {}
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span style="font-weight:600;"><i class="ph ph-calendar-blank"></i> ${rdDateStr}</span></td>
            <td>${storeName}</td>
            <td>${audit.auditor}</td>
            <td>${statusHtml}</td>
            <td>${actionHtml}</td>
        `;
        tbody.appendChild(tr);
    });

    document.querySelectorAll('.btn-do-followup').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parentId = e.currentTarget.getAttribute('data-id');
            const parentAudit = db.audits.find(a => a.id === parentId);
            if(parentAudit) {
                activeAuditType = 'retorno';
                parentAuditId = parentAudit.id;
                selectedStoreId = parentAudit.storeId;
                
                document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
                document.getElementById('audit-flow').classList.remove('hidden');
                
                document.querySelectorAll('.audit-step').forEach(s => s.classList.add('hidden'));
                document.getElementById('step-2').classList.remove('hidden');
                
                const store = db.stores.find(s => s.id === selectedStoreId);
                const titleEl = document.getElementById('current-store-title');
                if (titleEl) titleEl.innerText = store ? store.name + " (RETORNO)" : 'Loja (RETORNO)';
                
                if (typeof populateDepartments === 'function') {
                    populateDepartments();
                }
            }
        });
    });
}


    // --- Backup & Migração de Dados ---
    const btnExportDb = document.getElementById('btn-export-db');
    const btnImportDb = document.getElementById('btn-import-db');
    const dbFileInput = document.getElementById('db-file-input');

    if (btnExportDb) {
        btnExportDb.addEventListener('click', () => {
            const dataStr = localStorage.getItem('auditai_db');
            if (!dataStr) {
                alert('Nenhum dado encontrado para exportar!');
                return;
            }
            
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `auditai_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert('Backup exportado com sucesso! Guarde este arquivo.');
        });
    }

    if (btnImportDb && dbFileInput) {
        btnImportDb.addEventListener('click', () => {
            dbFileInput.click();
        });

        dbFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const confirmMsg = "ATENÇÃO: Importar um backup irá SOBRESCREVER todos os dados atuais do sistema!\n\nTem certeza que deseja continuar?";
            if (!confirm(confirmMsg)) {
                dbFileInput.value = ''; // reset
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonStr = e.target.result;
                    // Validate JSON
                    const parsedData = JSON.parse(jsonStr);
                    
                    // Simple logic validation to ensure it's AuditAí DB
                    if (parsedData && Array.isArray(parsedData.users) && Array.isArray(parsedData.audits)) {
                        localStorage.setItem('auditai_db', jsonStr);
                        alert('Banco de Dados importado com sucesso! O sistema ser reiniciado.');
                        window.location.reload();
                    } else {
                        alert('Arquivo inválido! O JSON não parece ser um backup do Auditaí.');
                    }
                } catch (err) {
                    alert('Erro ao ler o arquivo JSON. Certifique-se de que ele nao est corrompido.');
                    console.error('Import Error:', err);
                }
                dbFileInput.value = '';
            };
            reader.readAsText(file);
        });
    }


    // --- Blindagem de Segurança v17 ---
    
    // 1. Bloqueio de Clique Direito
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        // alert('Segurança: O menu de contexto está desativado para proteção do sistema.');
    });

    // 2. Bloqueio de Teclas de Atalho (F12, Ctrl+U, Ctrl+Shift+I/J)
    document.addEventListener('keydown', (e) => {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl + Shift + I or Ctrl + Shift + J or Ctrl + U
        if (e.ctrlKey && (e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || (e.ctrlKey && e.keyCode === 85)) {
            e.preventDefault();
            return false;
        }
    });

    // 3. Sistema Anti-Debugger e Limpeza de Console
    setInterval(() => {
        const devtools = /./;
        devtools.toString = function() {
            this.opened = true;
        };
        console.log('%c', devtools);
        if (devtools.opened) {
            // Se o console for aberto, limpa tudo ou desloga por segurança
            console.clear();
            console.log('%cACESSO RESTRITO', 'color: red; font-size: 40px; font-weight: bold;');
            console.log('%cAções não autorizadas estão sendo monitoradas.', 'color: white; font-size: 18px;');
        }
    }, 2000);

    // 4. Timer de Inatividade para Auto-Logout (30 minutos)
    let inactivityTimer;
    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        // Só ativa o timer se houver usuário logado
        if (sessionStorage.getItem('auditai_session')) {
            inactivityTimer = setTimeout(() => {
                alert('Sessão encerrada por inatividade (30 minutos). Por favor, realize o login novamente.');
                logout();
            }, 30 * 60 * 1000); // 30 minutos em milissegundos
        }
    };

    // Monitorar eventos de interação
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(name => {
        document.addEventListener(name, resetInactivityTimer, true);
    });
    resetInactivityTimer();

});