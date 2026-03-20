// ==========================================
// APP INITIALIZATION & UTILS
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {

    // --- Funções de Ofuscação e Integridade ---
    const _secretKey = "AUDITAI_SECURE_KEY_2026";
    
    const _obfuscate = (str) => {
        if (!str) return "";
        let result = "";
        for (let i = 0; i < str.length; i++) {
            result += String.fromCharCode(str.charCodeAt(i) ^ _secretKey.charCodeAt(i % _secretKey.length));
        }
        return btoa(unescape(encodeURIComponent(result)));
    };

    const _deobfuscate = (str) => {
        if (!str) return "";
        try {
            let decoded = decodeURIComponent(escape(atob(str)));
            let result = "";
            for (let i = 0; i < decoded.length; i++) {
                result += String.fromCharCode(decoded.charCodeAt(i) ^ _secretKey.charCodeAt(i % _secretKey.length));
            }
            return result;
        } catch (e) {
            return null;
        }
    };

    const supabaseUrl = 'https://nxyziofojebwqvdufoyb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54eXppb2ZvamVid3F2ZHVmb3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTgyNjcsImV4cCI6MjA4ODczNDI2N30.0wgbyBSZdkNDJCQYZgGO19NcV6oVo9TUEOaRruh82K0';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const _genChecksum = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    };

    const getCloudId = () => {
        if (currentUser) {
            // Força ID de usuário para o administrador/Ruan para evitar divergência de container
            if (currentUser.id === 'rec_ruan' || (currentUser.email && currentUser.email.toLowerCase() === 'ruangomes221102@gmail.com')) {
                return 'auditai_user_rec_ruan';
            }
            if (currentUser.companyId) return 'auditai_company_' + currentUser.companyId;
            return 'auditai_user_' + currentUser.id;
        }
        return 'auditai_main';
    };

    const saveDB = (syncCloud = false, forceMain = false) => {
        if (db.audits) db.audits = db.audits.filter(a => a && a.id && a.date);
        const jsonStr = JSON.stringify(db);
        const checksum = _genChecksum(jsonStr);
        const obfuscated = _obfuscate(jsonStr);
        localStorage.setItem('auditai_db', JSON.stringify({
            data: obfuscated,
            sig: checksum
        }));
        
        if (syncCloud) {
            const cloudId = forceMain ? 'auditai_main' : getCloudId();
            return supabase.from('app_state').upsert({ id: cloudId, db_data: db }, { onConflict: 'id' })
                .then(({error}) => { 
                    if(error) {
                        console.error("Erro Sync Nuvem:", error);
                        // Se for erro de RLS, dar uma dica no console
                        if (error.message.includes('row-level security')) {
                            console.warn("DICA: Verifique as políticas de RLS na tabela 'app_state' no Supabase.");
                        }
                        throw error;
                    }
                    console.log(`Sincronizado com Nuvem (${cloudId}) com sucesso.`);
                });
        }
    };

    window.publishToCloud = async () => {
        const btn = document.getElementById('btn-publish-cloud');
        const originalHtml = btn.innerHTML;
        try {
            if (!confirm("Deseja publicar seus dados atuais na nuvem? Isso tornará suas lojas e checklists visíveis para todos os usuários (ID: auditai_main).")) return;
            
            btn.disabled = true;
            btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Publicando...';
            
            // Força a gravação no container MASTER (auditai_main)
            await saveDB(true, true);
            
            alert("Dados publicados com sucesso! Agora todos os usuários terão acesso a estas informações.");
        } catch (err) {
            let msg = err.message;
            if (msg.includes('row-level security')) {
                msg = "Erro de Permissão (RLS). O Supabase não permitiu gravar esta nova linha. Role para baixo e siga as instruções de 'Correção Supabase'.";
            }
            alert("Erro ao publicar dados: " + msg);
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    };

    // --- State Management (LocalStorage DB) ---
    const defaultDepartments = [
        { id: "d1", name: "Açougue", weight: 10 },
        { id: "d2", name: "Hortifruit", weight: 10 },
        { id: "d3", name: "Frios", weight: 10 },
        { id: "d4", name: "Área de Vendas", weight: 10 },
        { id: "d5", name: "Frente de Loja", weight: 10 },
        { id: "d6", name: "Depósito", weight: 10 },
        { id: "d7", name: "Recebimento", weight: 10 },
        { id: "d8", name: "Avarias", weight: 10 },
        { id: "d_1772895370958", name: "Financeiro", weight: 10 },
        { id: "d_1772895434827", name: "Logistica Entrada", weight: 10 }
    ];

    const defaultCategories = [
        { id: "c1", name: "Higiene e Sanificacão", dept_id: "d1", weight_value: 10, status: "Ativo" },
        { id: "c2", name: "Controle de Temperaturas", dept_id: "d1", weight_value: 10, status: "Ativo" },
        { id: "c3", name: "Qualidade, Validade e Frescor", dept_id: "d1", weight_value: 9, status: "Ativo" },
        { id: "c4", name: "Organização e Exposição", dept_id: "d1", weight_value: 7, status: "Ativo" },
        { id: "c5", name: "Frescor e Qualidade dos Itens", dept_id: "d2", weight_value: 9, status: "Ativo" },
        { id: "c6", name: "Organização e Volume das Bancadas", dept_id: "d2", weight_value: 8, status: "Ativo" },
        { id: "c7", name: "Limpeza do Setor e Câmaras", dept_id: "d2", weight_value: 7, status: "Ativo" },
        { id: "c8", name: "Controle e Prevenção de Perdas", dept_id: "d2", weight_value: 8, status: "Ativo" },
        { id: "c9", name: "Cadeia de Frio e Temperaturas", dept_id: "d3", weight_value: 10, status: "Ativo" },
        { id: "c10", name: "Controle Rigoroso de Validade", dept_id: "d3", weight_value: 10, status: "Ativo" },
        { id: "c11", name: "Boas Práticas de Fatiamento", dept_id: "d3", weight_value: 9, status: "Ativo" },
        { id: "c12", name: "Abastecimento e Precificação", dept_id: "d3", weight_value: 7, status: "Ativo" },
        { id: "c13", name: "Limpeza de Gôndolas e Corredores", dept_id: "d4", weight_value: 7, status: "Ativo" },
        { id: "c14", name: "Precificação e Sinalização", dept_id: "d4", weight_value: 9, status: "Ativo" },
        { id: "c15", name: "Reposição e Frenteamento (Layout)", dept_id: "d4", weight_value: 8, status: "Ativo" },
        { id: "c16", name: "Abordagem e Atendimento", dept_id: "d4", weight_value: 7, status: "Ativo" },
        { id: "c17", name: "Saída de Mercadorias e Conferência", dept_id: "d5", weight_value: 10, status: "Ativo" },
        { id: "c18", name: "Outras Vendas (Delivery / iFood)", dept_id: "d5", weight_value: 8, status: "Ativo" },
        { id: "c19", name: "Vendas Balcão e Encomendas", dept_id: "d5", weight_value: 7, status: "Ativo" },
        { id: "c20", name: "Padrão de Atendimento (Checkout)", dept_id: "d5", weight_value: 9, status: "Ativo" },
        { id: "c21", name: "Organização e Endereçamento", dept_id: "d6", weight_value: 8, status: "Ativo" },
        { id: "c22", name: "Condições de Armazenamento", dept_id: "d6", weight_value: 10, status: "Ativo" },
        { id: "c23", name: "Sistema PEPS (Rodízio)", dept_id: "d6", weight_value: 9, status: "Ativo" },
        { id: "c24", name: "Limpeza e Descarte de Caixas", dept_id: "d6", weight_value: 6, status: "Ativo" },
        { id: "c25", name: "Conferência Cega e Qualidade", dept_id: "d7", weight_value: 10, status: "Ativo" },
        { id: "c26", name: "Limpeza e Agilidade na Doca", dept_id: "d7", weight_value: 7, status: "Ativo" },
        { id: "c27", name: "Triagem Imediata de Perecíveis", dept_id: "d7", weight_value: 10, status: "Ativo" },
        { id: "c28", name: "Organização e Segregação", dept_id: "d8", weight_value: 9, status: "Ativo" },
        { id: "c29", name: "Identificação e Registros no Sist.", dept_id: "d8", weight_value: 9, status: "Ativo" },
        { id: "c30", name: "Destinação Correta (Descarte)", dept_id: "d8", weight_value: 10, status: "Ativo" }
    ];

    const defaultChecklistItems = [
        { id: "i1", dept_id: "d1", cat_id: "c1", question: "Higienização dos balcões, pias e pisos (livres de resíduos).", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i2", dept_id: "d1", cat_id: "c1", question: "Limpeza das serras, moedores e facas após trocas de corte.", eh_critico: true, status: "Ativo", order: 2 },
        { id: "i3", dept_id: "d1", cat_id: "c1", question: "Estado dos ralos do setor (limpos, tampados, sem odores).", eh_critico: false, status: "Ativo", order: 3 },
        { id: "i4", dept_id: "d1", cat_id: "c1", question: "Higiene pessoal da equipe (uniformes, toucas, barba).", eh_critico: true, status: "Ativo", order: 4 },
        { id: "i5", dept_id: "d1", cat_id: "c1", question: "Recipientes de lixo tampados e higienizados regularmente.", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i6", dept_id: "d1", cat_id: "c2", question: "Temperatura das câmaras frias segundo padrão normativo.", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i7", dept_id: "d1", cat_id: "c2", question: "Aferição de temperatura dos balcões de exposição.", eh_critico: true, status: "Ativo", order: 2 },
        { id: "i8", dept_id: "d1", cat_id: "c2", question: "Preenchimento completo da planilha de controle térmico.", eh_critico: true, status: "Ativo", order: 3 },
        { id: "i9", dept_id: "d1", cat_id: "c2", question: "Calibração e funcionamento dos termômetros fixos/manuais.", eh_critico: false, status: "Ativo", order: 4 },
        { id: "i10", dept_id: "d1", cat_id: "c2", question: "Vedação e fechamento das portas das câmaras frias.", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i11", dept_id: "d1", cat_id: "c3", question: "Frescor, cor e odor das carnes (boi, frango, suíno).", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i12", dept_id: "d1", cat_id: "c3", question: "Controle de validade e recolhimento sistemático de vencidos.", eh_critico: true, status: "Ativo", order: 2 },
        { id: "i13", dept_id: "d1", cat_id: "c3", question: "Visibilidade de carimbos SIF/SIE e rastreabilidade.", eh_critico: false, status: "Ativo", order: 3 },
        { id: "i14", dept_id: "d1", cat_id: "c3", question: "Ausência de oxidação ou escurecimento excessivo nas carnes.", eh_critico: true, status: "Ativo", order: 4 },
        { id: "i15", dept_id: "d1", cat_id: "c3", question: "Integridade das embalagens a vácuo (sem furos ou ar).", eh_critico: true, status: "Ativo", order: 5 },
        { id: "i16", dept_id: "d1", cat_id: "c4", question: "Layout visual da vitrine (bandejas sem sangue, estética).", eh_critico: false, status: "Ativo", order: 1 },
        { id: "i17", dept_id: "d1", cat_id: "c4", question: "Presença e nitidez das etiquetas de preço nos cortes.", eh_critico: false, status: "Ativo", order: 2 },
        { id: "i18", dept_id: "d1", cat_id: "c4", question: "Organização do estoque interno (caixas identificadas).", eh_critico: false, status: "Ativo", order: 3 },
        { id: "i19", dept_id: "d1", cat_id: "c4", question: "Separação adequada de tipos de carne na exposição.", eh_critico: false, status: "Ativo", order: 4 },
        { id: "i20", dept_id: "d1", cat_id: "c4", question: "Estado de conservação de bandejas e ganchos de exposição.", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i21", dept_id: "d2", cat_id: "c5", question: "Retirada de produtos machucados, murchos ou com mofo.", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i22", dept_id: "d2", cat_id: "c5", question: "Exposição de mercadorias sem contato direto com o chão.", eh_critico: true, status: "Ativo", order: 2 },
        { id: "i23", dept_id: "d2", cat_id: "c5", question: "Grau de maturação dos itens (frutas no padrão de venda).", eh_critico: false, status: "Ativo", order: 3 },
        { id: "i24", dept_id: "d2", cat_id: "c5", question: "Ausência de insetos (moscas de fruta) na área de vendas.", eh_critico: true, status: "Ativo", order: 4 },
        { id: "i25", dept_id: "d2", cat_id: "c5", question: "Qualidade dos perecíveis pesados e embalados (FLV).", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i26", dept_id: "d2", cat_id: "c6", question: "Sensação de abundância (bancadas fartas, sem buracos).", eh_critico: false, status: "Ativo", order: 1 },
        { id: "i27", dept_id: "d2", cat_id: "c6", question: "Conformidade de etiquetas de preço com os produtos.", eh_critico: false, status: "Ativo", order: 2 },
        { id: "i28", dept_id: "d2", cat_id: "c6", question: "Organização e alinhamento das bancadas por família.", eh_critico: false, status: "Ativo", order: 3 },
        { id: "i29", dept_id: "d2", cat_id: "c6", question: "Sinalização de ofertas e cartazes limpos e visíveis.", eh_critico: false, status: "Ativo", order: 4 },
        { id: "i30", dept_id: "d2", cat_id: "c6", question: "Disponibilidade de sacos plásticos para pesagem.", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i31", dept_id: "d2", cat_id: "c7", question: "Limpeza do piso (seco e sem caldas ou restos de folha).", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i32", dept_id: "d2", cat_id: "c7", question: "Lavação e higienização das caixas plásticas de colheita.", eh_critico: false, status: "Ativo", order: 2 },
        { id: "i33", dept_id: "d2", cat_id: "c7", question: "Limpeza interna da câmara fria (pisos/prateleiras).", eh_critico: false, status: "Ativo", order: 3 },
        { id: "i34", dept_id: "d2", cat_id: "c7", question: "Lixeiras do setor limpas, fechadas e com sacos novos.", eh_critico: false, status: "Ativo", order: 4 },
        { id: "i35", dept_id: "d2", cat_id: "c7", question: "Ausência de odores de produtos em decomposição.", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i36", dept_id: "d2", cat_id: "c8", question: "Rodízio PEPS: produtos maduros na frente/saída.", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i37", dept_id: "d2", cat_id: "c8", question: "Manuseio cuidadoso da equipe no abastecimento (sem queda).", eh_critico: false, status: "Ativo", order: 2 },
        { id: "i38", dept_id: "d2", cat_id: "c8", question: "Registro sistemático de quebras/perdas no sistema.", eh_critico: true, status: "Ativo", order: 3 },
        { id: "i39", dept_id: "d2", cat_id: "c8", question: "Empilhamento seguro para evitar esmagamento de itens.", eh_critico: false, status: "Ativo", order: 4 },
        { id: "i40", dept_id: "d2", cat_id: "c8", question: "Ação de venda rápida para produtos com giro baixo.", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i41", dept_id: "d3", cat_id: "c9", question: "Temperatura ideal nos termômetros das ilhas congeladas.", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i42", dept_id: "d3", cat_id: "c9", question: "Respeito ao limite da linha de enchimento da geladeira.", eh_critico: false, status: "Ativo", order: 2 },
        { id: "i43", dept_id: "d3", cat_id: "c9", question: "Ausência de formação de gelo excessivo nos balcões.", eh_critico: false, status: "Ativo", order: 3 },
        { id: "i44", dept_id: "d3", cat_id: "c9", question: "Temperatura dos laticínios nas prateleiras resfriadas.", eh_critico: true, status: "Ativo", order: 4 },
        { id: "i45", dept_id: "d3", cat_id: "c9", question: "Uso correto das cortinas noturnas nos expositores.", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i46", dept_id: "d3", cat_id: "c10", question: "Ausência de produtos vencidos (leites, queijos, frios).", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i47", dept_id: "d3", cat_id: "c10", question: "Datas de manipulação corretas nas etiquetas de frios.", eh_critico: true, status: "Ativo", order: 2 },
        { id: "i48", dept_id: "d3", cat_id: "c10", question: "Validade de itens em oferta/promoção monitorada.", eh_critico: true, status: "Ativo", order: 3 },
        { id: "i49", dept_id: "d3", cat_id: "c10", question: "Aplicação do sistema PVPS (Vence primeiro, Sai primeiro).", eh_critico: true, status: "Ativo", order: 4 },
        { id: "i50", dept_id: "d3", cat_id: "c10", question: "Integridade das embalagens (sem rasgos ou vazamentos).", eh_critico: true, status: "Ativo", order: 5 },
        { id: "i51", dept_id: "d3", cat_id: "c11", question: "Uso unânime de EPIs (luva de aço/touca) no fatiamento.", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i52", dept_id: "d3", cat_id: "c11", question: "Higienização da fatiadora e tábua entre trocas.", eh_critico: true, status: "Ativo", order: 2 },
        { id: "i53", dept_id: "d3", cat_id: "c11", question: "Troca de luvas descartáveis ao mudar tipo de produto.", eh_critico: true, status: "Ativo", order: 3 },
        { id: "i54", dept_id: "d3", cat_id: "c11", question: "Organização da bancada interna de fatiamento.", eh_critico: false, status: "Ativo", order: 4 },
        { id: "i55", dept_id: "d3", cat_id: "c11", question: "Etiquetagem imediata após fatiamento e pesagem.", eh_critico: true, status: "Ativo", order: 5 },
        { id: "i56", dept_id: "d3", cat_id: "c12", question: "Frenteamento de iogurtes, massas e lácteos (rótulo visível).", eh_critico: false, status: "Ativo", order: 1 },
        { id: "i57", dept_id: "d3", cat_id: "c12", question: "Conformidade de preços reais com os precificadores.", eh_critico: true, status: "Ativo", order: 2 },
        { id: "i58", dept_id: "d3", cat_id: "c12", question: "Variedade e SKUs conforme mix padrão (estoque/venda).", eh_critico: false, status: "Ativo", order: 3 },
        { id: "i59", dept_id: "d3", cat_id: "c12", question: "Ausência de etiquetas sobrepostas ou confusas.", eh_critico: false, status: "Ativo", order: 4 },
        { id: "i60", dept_id: "d3", cat_id: "c12", question: "Reposição frequente de itens de alto giro (manteigas).", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i61", dept_id: "d4", cat_id: "c13", question: "Ausência de pó ou manchas no topo das embalagens.", eh_critico: false, status: "Ativo", order: 1 },
        { id: "i62", dept_id: "d4", cat_id: "c13", question: "Corredores livres de paletes vazios ou obstáculos.", eh_critico: true, status: "Ativo", order: 2 },
        { id: "i63", dept_id: "d4", cat_id: "c13", question: "Limpeza da base das gôndolas, cantos e rodapés.", eh_critico: false, status: "Ativo", order: 3 },
        { id: "i64", dept_id: "d4", cat_id: "c13", question: "Ausência de restos de embalagens ou fitas no chão.", eh_critico: false, status: "Ativo", order: 4 },
        { id: "i65", dept_id: "d4", cat_id: "c13", question: "Carrinhos de abastecimento organizados na área.", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i66", dept_id: "d4", cat_id: "c14", question: "100% de produtos com etiqueta de preço correta.", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i67", dept_id: "d4", cat_id: "c14", question: "Limpeza e estado dos cartazes (sem rasgos ou remendos).", eh_critico: false, status: "Ativo", order: 2 },
        { id: "i68", dept_id: "d4", cat_id: "c14", question: "Funcionamento de terminais de consulta de preço.", eh_critico: true, status: "Ativo", order: 3 },
        { id: "i69", dept_id: "d4", cat_id: "c14", question: "Sinalização de corredores correta e limpa.", eh_critico: false, status: "Ativo", order: 4 },
        { id: "i70", dept_id: "d4", cat_id: "c14", question: "Destaque visual adequado para ofertas de tabloide.", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i71", dept_id: "d4", cat_id: "c15", question: "Alinhamento frontal (frenteamento) dos produtos.", eh_critico: false, status: "Ativo", order: 1 },
        { id: "i72", dept_id: "d4", cat_id: "c15", question: "Ausência de buracos/rupturas (maquiagem correta).", eh_critico: false, status: "Ativo", order: 2 },
        { id: "i73", dept_id: "d4", cat_id: "c15", question: "Ocupação de share conforme planograma de venda.", eh_critico: false, status: "Ativo", order: 3 },
        { id: "i74", dept_id: "d4", cat_id: "c15", question: "Ausência de caixas cortadas rudimentares na gôndola.", eh_critico: false, status: "Ativo", order: 4 },
        { id: "i75", dept_id: "d4", cat_id: "c15", question: "Integridade das embalagens expostas (latas/vidros).", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i76", dept_id: "d4", cat_id: "c16", question: "Postura, simpatia e disposição da equipe de vendas.", eh_critico: false, status: "Ativo", order: 1 },
        { id: "i77", dept_id: "d4", cat_id: "c16", question: "Uso do uniforme padrão impecável e crachá visível.", eh_critico: false, status: "Ativo", order: 2 },
        { id: "i78", dept_id: "d4", cat_id: "c16", question: "Conhecimento da equipe sobre localização de itens.", eh_critico: false, status: "Ativo", order: 3 },
        { id: "i79", dept_id: "d4", cat_id: "c16", question: "Proatividade em auxiliar clientes (idosos/deficientes).", eh_critico: false, status: "Ativo", order: 4 },
        { id: "i80", dept_id: "d4", cat_id: "c16", question: "Ausência de uso de celular pessoal em áreas de venda.", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i81", dept_id: "d5", cat_id: "c17", question: "Vistoria de grandes volumes nas compras (fiscais).", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i82", dept_id: "d5", cat_id: "c17", question: "Conferência \"embaixo do carrinho\" pelos operadores.", eh_critico: false, status: "Ativo", order: 2 },
        { id: "i83", dept_id: "d5", cat_id: "c17", question: "Conferência de itens pesados no checkout (PLUs).", eh_critico: true, status: "Ativo", order: 3 },
        { id: "i84", dept_id: "d5", cat_id: "c17", question: "Monitoramento das cancelas/antenas de segurança.", eh_critico: true, status: "Ativo", order: 4 },
        { id: "i85", dept_id: "d5", cat_id: "c17", question: "Controle de sangria e fundo de caixa rigoroso.", eh_critico: true, status: "Ativo", order: 5 },
        { id: "i86", dept_id: "d5", cat_id: "c18", question: "Blindagem/lacre de sacolas de delivery/e-commerce.", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i87", dept_id: "d5", cat_id: "c18", question: "Agilidade/tempo no empacotamento das encomendas.", eh_critico: false, status: "Ativo", order: 2 },
        { id: "i88", dept_id: "d5", cat_id: "c18", question: "Qualidade dos produtos escolhidos pelos pickers.", eh_critico: true, status: "Ativo", order: 3 },
        { id: "i89", dept_id: "d5", cat_id: "c18", question: "Organização da área de despacho e bags de entrega.", eh_critico: false, status: "Ativo", order: 4 },
        { id: "i90", dept_id: "d5", cat_id: "c18", question: "Comunicação cliente/loja em caso de substituições.", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i91", dept_id: "d5", cat_id: "c19", question: "Velocidade na entrega de encomendas agendadas.", eh_critico: false, status: "Ativo", order: 1 },
        { id: "i92", dept_id: "d5", cat_id: "c19", question: "Liderança e registro correto de devoluções no SAC.", eh_critico: false, status: "Ativo", order: 2 },
        { id: "i93", dept_id: "d5", cat_id: "c19", question: "Organização e limpeza do balcão de SAC/Informações.", eh_critico: false, status: "Ativo", order: 3 },
        { id: "i94", dept_id: "d5", cat_id: "c19", question: "Tempo de espera para faturas/cartão próprio da loja.", eh_critico: false, status: "Ativo", order: 4 },
        { id: "i95", dept_id: "d5", cat_id: "c19", question: "Preenchimento completo de formulários de encomenda.", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i96", dept_id: "d5", cat_id: "c20", question: "Grau de simpatia e ausência de conversas paralelas.", eh_critico: false, status: "Ativo", order: 1 },
        { id: "i97", dept_id: "d5", cat_id: "c20", question: "Balanças de checkout alinhadas e com nível de bolha.", eh_critico: true, status: "Ativo", order: 2 },
        { id: "i98", dept_id: "d5", cat_id: "c20", question: "Operador oferece programa fidelidade/CPF na nota.", eh_critico: false, status: "Ativo", order: 3 },
        { id: "i99", dept_id: "d5", cat_id: "c20", question: "Tempo médio de fila (abertura rápida de novos PDVs).", eh_critico: false, status: "Ativo", order: 4 },
        { id: "i100", dept_id: "d5", cat_id: "c20", question: "Atenção do operador no manuseio de notas e moedas.", eh_critico: true, status: "Ativo", order: 5 },
        { id: "i101", dept_id: "d6", cat_id: "c21", question: "Saídas de emergência principais e secundárias livres.", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i102", dept_id: "d6", cat_id: "c21", question: "Agrupamento lógico visual das caixas no pulmão.", eh_critico: false, status: "Ativo", order: 2 },
        { id: "i103", dept_id: "d6", cat_id: "c21", question: "Endereçamento de picking identificado corretamente.", eh_critico: false, status: "Ativo", order: 3 },
        { id: "i104", dept_id: "d6", cat_id: "c21", question: "Ausência de paletes em corredores de circulação.", eh_critico: true, status: "Ativo", order: 4 },
        { id: "i105", dept_id: "d6", cat_id: "c21", question: "Transpaleteiras guardas em local apropriado.", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i106", dept_id: "d6", cat_id: "c22", question: "Uso de paletes para descarga (sem contato com chão).", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i107", dept_id: "d6", cat_id: "c22", question: "Imunidade a pragas (ambiente seco e sem fezes).", eh_critico: true, status: "Ativo", order: 2 },
        { id: "i108", dept_id: "d6", cat_id: "c22", question: "Respeito à altura máxima de empilhamento seguro.", eh_critico: false, status: "Ativo", order: 3 },
        { id: "i109", dept_id: "d6", cat_id: "c22", question: "Separação de químicos e alimentos no estoque.", eh_critico: true, status: "Ativo", order: 4 },
        { id: "i110", dept_id: "d6", cat_id: "c22", question: "Integridade física do teto (sem goteiras/infiltração).", eh_critico: true, status: "Ativo", order: 5 },
        { id: "i111", dept_id: "d6", cat_id: "c23", question: "Puxada PEPS (Primeiro que Vence é o Primeiro que Sai).", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i112", dept_id: "d6", cat_id: "c23", question: "Marcação lateral de validade legível nas caixas.", eh_critico: false, status: "Ativo", order: 2 },
        { id: "i113", dept_id: "d6", cat_id: "c23", question: "Etiquetagem de identificação de validade por palete.", eh_critico: false, status: "Ativo", order: 3 },
        { id: "i114", dept_id: "d6", cat_id: "c23", question: "Monitoramento de itens com giro baixo (vencimento).", eh_critico: false, status: "Ativo", order: 4 },
        { id: "i115", dept_id: "d6", cat_id: "c23", question: "Ausência de mistura de validades no mesmo nicho.", eh_critico: false, status: "Ativo", order: 5 },
        { id: "i120", dept_id: "d6", cat_id: "c24", question: "Limpeza e Descarte de Caixas", eh_critico: false, status: "Ativo", order: 1 },
        { id: "i121", dept_id: "d7", cat_id: "c25", question: "Conferência Cega e Qualidade", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i122", dept_id: "d7", cat_id: "c26", question: "Limpeza e Agilidade na Doca", eh_critico: false, status: "Ativo", order: 1 },
        { id: "i123", dept_id: "d7", cat_id: "c27", question: "Triagem Imediata de Perecíveis", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i124", dept_id: "d8", cat_id: "c28", question: "Organização e Segregação", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i125", dept_id: "d8", cat_id: "c29", question: "Identificação e Registros no Sist.", eh_critico: true, status: "Ativo", order: 1 },
        { id: "i126", dept_id: "d8", cat_id: "c30", question: "Destinação Correta (Descarte)", eh_critico: true, status: "Ativo", order: 1 }
    ];

    const defaultStores = [
        { id: "s_1772887180765", companyId: "comp_1772834768448", code: "1", name: "MATRIZ", city: "BELÉM" },
        { id: "s_1772887228060", companyId: "comp_1772834768448", code: "3", name: "MARIO COVAS", city: "ANANINDEUA" },
        { id: "s_1772887250270", companyId: "comp_1772834768448", code: "4", name: "PEDREIRA", city: "BELÉM" },
        { id: "s_1772887267490", companyId: "comp_1772834768448", code: "5", name: "TERRA FIRME", city: "BELÉM" },
        { id: "s_1772887281183", companyId: "comp_1772834768448", code: "7", name: "JURUNAS", city: "BELÉM" },
        { id: "s_1772887300887", companyId: "comp_1772834768448", code: "8", name: "UMARIZAL", city: "BELÉM" }
    ];

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
    const adjustColor = (hex, amt) => {
        let usePound = false;
        if (hex[0] === "#") {
            hex = hex.slice(1);
            usePound = true;
        }
        let num = parseInt(hex, 16);
        let r = (num >> 16) + amt;
        if (r > 255) r = 255; else if (r < 0) r = 0;
        let b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) b = 255; else if (b < 0) b = 0;
        let g = (num & 0x0000FF) + amt;
        if (g > 255) g = 255; else if (g < 0) g = 0;
        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
    };

    const applyTheme = (color) => {
        const root = document.documentElement;
        const primaryColor = color || '#ef4444';
        let hoverColor = '#dc2626';
        
        try {
            if (color) hoverColor = adjustColor(color, -20);
        } catch (e) {
            console.error("Error adjusting color:", e);
        }
        
        root.style.setProperty('--primary-dept', primaryColor);
        root.style.setProperty('--primary-dept-hover', hoverColor);
    };

    // --- Settings Persistence ---
    function loadSettings() {
        // Obsoleto
    }


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
    const loadDB = async () => {
        // 1. Tentar recuperar banco local para identificar o usuário antes do fetch
        const stored = localStorage.getItem('auditai_db');
        let localData = null;
        if (stored) {
            try {
                let payload = JSON.parse(stored);
                if (payload.data && payload.sig) {
                    const jsonStr = _deobfuscate(payload.data);
                    if (jsonStr) {
                         const currentChecksum = _genChecksum(jsonStr);
                         if (currentChecksum === payload.sig) localData = JSON.parse(jsonStr);
                    }
                } else if (payload.users) {
                    localData = payload;
                }
            } catch (err) { console.error("Local parse error", err); }
        }

        // 2. Tentar restaurar sessão do currentUser antes de definir o cloudId
        if (!currentUser && localData && localData.users) {
            const sessionEmail = sessionStorage.getItem('auditai_session');
            if (sessionEmail) currentUser = localData.users.find(u => (u.email || "").toLowerCase() === sessionEmail.toLowerCase());
        }

        let cloudData = null;
        try {
            const cloudId = getCloudId();
            console.log(`Tentando sincronizar com Supabase (${cloudId})...`);
            const { data, error } = await supabase.from('app_state').select('db_data').eq('id', cloudId).single();
            
            if (!error && data && data.db_data) {
                cloudData = data.db_data;
                console.log("Dados recuperados da Nuvem.");
            } else if (cloudId !== 'auditai_main') {
                const { data: mainData } = await supabase.from('app_state').select('db_data').eq('id', 'auditai_main').single();
                if (mainData) cloudData = mainData.db_data;
            }
        } catch(err) {
            console.warn("Falha no Supabase. Fallback para LocalStorage:", err.message);
        }

        // --- GLOBAL SYNC STRATEGY ---
        let mergedAudits = [];
        let auditsChanged = false;

        // 1. Prioridade Nuvem para Configurações (Single Source of Truth)
        if (cloudData && cloudData.users) {
            db = cloudData;
            // Garantir que arrays existem
            if (!db.audits) db.audits = [];
            if (!db.stores) db.stores = defaultStores;
            if (!db.departments) db.departments = defaultDepartments;
            if (!db.categories) db.categories = defaultCategories;
            if (!db.checklistItems) db.checklistItems = defaultChecklistItems;
            if (!db.companies) db.companies = [];
            
            mergedAudits = [...db.audits];
        } 
        // 2. Fallback Local para Configurações
        else if (localData && localData.users) {
            db = localData;
            mergedAudits = [...(db.audits || [])];
        }
        // 3. Fallback para defaults (App Novo)
        else {
            db = {
                users: [],
                stores: defaultStores,
                departments: defaultDepartments,
                categories: defaultCategories,
                checklistItems: defaultChecklistItems,
                audits: [],
                companies: [],
                config: { emailjs_service: '', emailjs_template: '', emailjs_public_key: '' }
            };
        }

        // --- SMART AUDIT MERGE ---
        // Recuperar auditorias locais que não estão na nuvem
        if (localData && localData.audits && Array.isArray(localData.audits)) {
            localData.audits.forEach(localAudit => {
                if (localAudit && localAudit.id) {
                    const exists = mergedAudits.find(a => a.id === localAudit.id);
                    if (!exists) {
                        mergedAudits.push(localAudit);
                        auditsChanged = true;
                        console.log(`Auditoria local recuperada: ${localAudit.id}`);
                    }
                }
            });
        }
        
        db.audits = mergedAudits;

        // Se o merge trouxe novos dados locais que não estavam na nuvem, sobe eles agora
        if (auditsChanged) {
             console.log("Novas auditorias detectadas. Sincronizando com a nuvem...");
             saveDB(true);
        } else if (cloudData) {
             // Apenas atualiza o backup local se veio da nuvem
             const jsonStr = JSON.stringify(db);
             localStorage.setItem('auditai_db', JSON.stringify({
                 data: _obfuscate(jsonStr),
                 sig: _genChecksum(jsonStr)
             }));
        }
        
        // Sanitizações globais e injeções (Ruan user)
        if (!db.categories) db.categories = defaultCategories;
        if (!db.companies) db.companies = [];
        if (!db.audits) db.audits = [];
        db.audits = db.audits.filter(a => a && a.id && a.date);
        if (!db.config) db.config = { emailjs_service: '', emailjs_template: '', emailjs_public_key: '' };

        // Injeção de Alçada de Decisão (Novo Campo)
        if (db.checklistItems) {
            db.checklistItems.forEach(item => {
                if (item.eh_alcada === undefined) {
                    // Itens específicos que são Alçada de Diretoria (Investimento/Estrutura)
                    const alcadaIds = ['i110', 'i6', 'i97', 'i41', 'i126']; 
                    item.eh_alcada = alcadaIds.includes(item.id);
                }
            });
        }

        const needsUpdate = !db.checklistItems || db.checklistItems.length < 50 || db.checklistItems.some(i => !i.dept_id);
        if (needsUpdate) {
            db.categories = defaultCategories;
            db.checklistItems = defaultChecklistItems;
            saveDB();
        }

        if (!db.departments) db.departments = [];
        let deptsAdded = false;
        defaultDepartments.forEach(defDept => {
            if (!db.departments.find(d => d.id === defDept.id || (d.name||"").toLowerCase() === defDept.name.toLowerCase())) {
                db.departments.push(defDept);
                deptsAdded = true;
            }
        });
        if (deptsAdded) saveDB();

        if (db.departments && db.departments.length > 0) {
            const totalW = db.departments.reduce((sum, d) => sum + (parseFloat(d.weight) || 0), 0);
            if (Math.abs(totalW - 100) > 1) {
                const baseWeight = 100 / db.departments.length;
                db.departments.forEach(d => d.weight = Math.round(baseWeight * 10) / 10);
                saveDB();
            }
        }

        const recoveryEmail = 'ruangomes221102@gmail.com';
        let ruanUser = db.users ? db.users.find(u => u.email === recoveryEmail) : null;
        if (!db.users) db.users = [];
        if (!ruanUser) {
            ruanUser = {
                id: 'rec_ruan', name: 'Ruan Gomes', email: recoveryEmail, pass: '123456', role: 'admin', status: 'aprovado'
            };
            db.users.push(ruanUser);
        } else {
            ruanUser.pass = '123456'; ruanUser.role = 'admin'; ruanUser.status = 'aprovado'; ruanUser.name = 'Ruan Gomes';
        }
        
        if (db.companies && db.companies.length > 0 && (!ruanUser.companyId || ruanUser.companyId === '')) {
            // Removida atribuição automática volátil de empresa para evitar quebra de sincronia
            // ruanUser.companyId = db.companies[0].id;
        }
    };
    
    const updateAuthUI = () => {
        if (!currentUser && db.users) {
            const sessionEmail = sessionStorage.getItem('auditai_session');
            if (sessionEmail) currentUser = db.users.find(u => u.email === sessionEmail);
        }

        if (currentUser) {
            if (currentUser.status === 'pendente') {
                authView.classList.remove('hidden');
                appView.classList.add('hidden');
                pendingMsg.classList.remove('hidden');
            } else {
                authView.classList.add('hidden');
                appView.classList.remove('hidden');
                
                // Tema da Empresa
                if (currentUser.companyId && db.companies) {
                    const comp = db.companies.find(c => c.id === currentUser.companyId);
                    if (comp && comp.colors) {
                        document.documentElement.style.setProperty('--primary', comp.colors.primary);
                        document.documentElement.style.setProperty('--primary-hover', comp.colors.primary);
                        document.documentElement.style.setProperty('--secondary', comp.colors.secondary);
                        document.documentElement.style.setProperty('--accent', comp.colors.accent);
                    }
                }
                
                sidebarUserName.innerText = (currentUser.name || "Usuário").split(' ')[0];
                sidebarUserRole.innerText = currentUser.role === 'admin' ? 'Administrador' : 'Usuário';
                sidebarAvatar.innerText = (currentUser.name || "U").charAt(0).toUpperCase();

                if (currentUser.role === 'admin') {
                    document.getElementById('nav-admin').classList.remove('hidden');
                } else {
                    document.getElementById('nav-admin').classList.add('hidden');
                }

                // Garantir visibilidade dos botões principais
                document.querySelectorAll('.nav-btn').forEach(btn => {
                    if (!btn.classList.contains('admin-only')) {
                        btn.classList.remove('hidden');
                    }
                });

                populateStores();
                renderAuditHistory();

                // Garantir que uma seção esteja visível (padrão Histórico se nada estiver ativo)
                const activeSection = Array.from(document.querySelectorAll('.content-section')).find(s => !s.classList.contains('hidden'));
                if (!activeSection) {
                    switchSection('audits-list-view');
                }
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
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const pass = document.getElementById('login-pass').value.trim();

        // EMERGENCY BYPASS FOR RUAN
        if (email === 'ruangomes221102@gmail.com' && pass === '123456') {
            const ruan = {
                id: 'rec_ruan',
                name: 'Ruan Gomes',
                email: email,
                pass: pass,
                role: 'admin',
                status: 'aprovado',
                companyId: (db.companies && db.companies.length > 0) ? db.companies[0].id : null
            };
            // Force save to users if not there
            if (!db.users.find(u => (u.email || "").toLowerCase() === email)) {
                db.users.push(ruan);
                saveDB();
            }
            sessionStorage.setItem('auditai_session', email);
            currentUser = ruan;
            updateAuthUI();
            return;
        }

        const user = db.users.find(u => (u.email || "").toLowerCase() === email && u.pass === pass);
        if (user) {
            sessionStorage.setItem('auditai_session', user.email);
            currentUser = user;
            
            // Tentar carregar dados da nuvem específicos deste usuário/empresa logo após o login
            loadDB().then(() => {
                updateAuthUI();
            });
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
            name, email, pass, role: 'auditor', companyId: null, // Auditor por padrão
            status: 'aprovado'
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
        sessionStorage.removeItem('auditai_session');
        currentUser = null;
        updateAuthUI();
        
        // Reset auth screen view to Login specifically
        if (typeof showAuthScreen === 'function') showAuthScreen('login-form');
        if (typeof tabLogin !== 'undefined' && typeof tabRegister !== 'undefined') {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
        }
        if (typeof authTabsContainer !== 'undefined' && authTabsContainer) {
            authTabsContainer.style.display = '';
        }
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
        console.log(`Switching to section: ${sectionId}`);
        contentSections.forEach(s => s.classList.add('hidden'));
        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.remove('hidden');
        } else {
            console.error(`Target section NOT FOUND: ${sectionId}`);
        }

        navBtns.forEach(b => b.classList.remove('active'));
        document.querySelector(`.nav-btn[data-target="${sectionId}"]`)?.classList.add('active');

        // Proactive Rendering
        if (sectionId === 'audits-list-view' && typeof renderAuditHistory === 'function') {
            renderAuditHistory();
        }
        if (sectionId === 'dashboard-view' && typeof renderDashboard === 'function') {
            renderDashboard();
        }
        if (sectionId === 'scheduled-audits-view' && typeof renderScheduledAudits === 'function') {
            renderScheduledAudits();
        }
        if (sectionId === 'admin-view') {
            if (typeof renderAdminUsers === 'function') renderAdminUsers();
            if (typeof renderAdminStores === 'function') renderAdminStores();
            if (typeof window.renderAdminCompanies === 'function') window.renderAdminCompanies();
            if (typeof window.renderAdminDepts === 'function') window.renderAdminDepts();
            if (typeof window.renderAdminCategories === 'function') window.renderAdminCategories();
            if (typeof window.renderAdminChecklists === 'function') window.renderAdminChecklists();
            if (typeof renderAdminSettings === 'function') renderAdminSettings();
        }

        if (window.innerWidth <= 900) closeSidebar();
    };

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchSection(btn.getAttribute('data-target'));
        });
    });

    const btnManualSync = document.getElementById('btn-manual-sync');
    if (btnManualSync) {
        btnManualSync.addEventListener('click', async () => {
            const originalHtml = btnManualSync.innerHTML;
            try {
                btnManualSync.disabled = true;
                btnManualSync.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Sincronizando...';
                
                await loadDB();
                updateAuthUI();
                
                // Forçar atualização de views se estiverem abertas
                const activeSection = Array.from(contentSections).find(s => !s.classList.contains('hidden'));
                if (activeSection && activeSection.id === 'audits-list-view') renderAuditHistory();
                if (activeSection && activeSection.id === 'dashboard-view') renderDashboard();
                
                alert('Sincronização concluída com sucesso!');
            } catch (err) {
                console.error("Manual Sync Error:", err);
                alert('Erro ao sincronizar: ' + err.message);
            } finally {
                btnManualSync.disabled = false;
                btnManualSync.innerHTML = originalHtml;
            }
        });
    }

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
            const alcadaBadge = item.eh_alcada ? '<span class="badge badge-info" style="background:#dbeafe; color:#1e40af; border:none; margin-left:5px;">ALÇADA DIRETORIA</span>' : '';
            
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
                <div class="audit-item" data-item="${item.id}" data-critical="${item.eh_critico}" data-alcada="${item.eh_alcada}" style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px dashed var(--border);">
                    <p class="audit-question" style="font-weight: 600; margin-bottom: 12px;">${item.question} ${criticoBadge} ${alcadaBadge}</p>
                    ${beforePhotoHtml}
                    <div class="rating-group" style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button class="rating-btn ruim" data-val="ruim"><i class="ph ph-x-circle"></i> Ruim</button>
                         <button class="rating-btn insuficiente" data-val="insuficiente"><i class="ph ph-warning-circle"></i> Insuficiente</button>
                         <button class="rating-btn bom" data-val="bom"><i class="ph ph-check-circle"></i> Bom</button>
                         <button class="rating-btn excelente" data-val="excelente"><i class="ph ph-star"></i> Excelente</button>
                    </div>
                    
                    <div class="treaty-container hidden" style="margin-top: 12px; background: rgba(0,0,0,0.02); padding: 12px; border-radius: 8px; border: 1px solid var(--border);">
                        <label style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 5px;">STATUS DE TRATATIVA (OBRIGATÓRIO)</label>
                        <select class="item-treaty" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border); font-size: 0.85rem;">
                            <option value="">-- Selecione o Status --</option>
                            <option value="Não Tratado">Não Tratado</option>
                            <option value="Tratado no Ato">Tratado no Ato</option>
                            <option value="Repassado para Terceiros">Repassado para Terceiros</option>
                        </select>
                    </div>

                    <textarea class="item-obs hidden" placeholder="Justifique e detalhe o problema (Obrigatório para itens críticos/ruins)" style="margin-top: 12px; width:100%; min-height:80px;"></textarea>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 12px;">
                        <button class="btn btn-ghost btn-add-photo" style="font-size: 0.85rem;"><i class="ph ph-camera"></i> Adicionar Foto</button>
                        <span class="photo-required-label hidden" style="font-size: 0.7rem; color: var(--danger); font-weight: 600;">* FOTO OBRIGATÓRIA</span>
                    </div>
                    <input type="file" class="hidden-photo-input hidden" accept="image/*">
                    <div class="photo-preview-container" style="margin-top: 12px; display: none;"></div>
                </div>
            `;
        });

        sec.innerHTML = html;
        container.appendChild(sec);


        // Add event listeners to rating buttons
        document.querySelectorAll('.audit-item').forEach(itemEl => {
            const btns = itemEl.querySelectorAll('.rating-btn');
            const obsEl = itemEl.querySelector('.item-obs');
            const treatyContainer = itemEl.querySelector('.treaty-container');
            const photoLabel = itemEl.querySelector('.photo-required-label');
            const btnAddPhoto = itemEl.querySelector('.btn-add-photo');
            const fileInput = itemEl.querySelector('.hidden-photo-input');
            const previewContainer = itemEl.querySelector('.photo-preview-container');
            const isCritico = itemEl.dataset.critical === "true";

            if(btnAddPhoto && fileInput) {
                btnAddPhoto.addEventListener('click', () => {
                    fileInput.click();
                });

                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if(!file) return;
                    
                    if (typeof supabase !== 'undefined') {
                        btnAddPhoto.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Enviando...';
                        btnAddPhoto.disabled = true;

                        const fileName = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');
                        
                        supabase.storage.from('audit_photos').upload(fileName, file)
                            .then(({ data, error }) => {
                                if (error) {
                                    console.error('Supabase Storage Error:', error);
                                    alert('Erro ao enviar foto para nuvem: ' + error.message);
                                    btnAddPhoto.innerHTML = '<i class="ph ph-camera"></i> Adicionar Foto';
                                } else {
                                    const { data: publicUrlData } = supabase.storage.from('audit_photos').getPublicUrl(fileName);
                                    if (publicUrlData && publicUrlData.publicUrl) {
                                        const url = publicUrlData.publicUrl;
                                        itemEl.dataset.photoBase64 = url;
                                        previewContainer.innerHTML = `<img src="${url}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border); margin-top: 8px;">`;
                                        previewContainer.style.display = 'block';
                                        btnAddPhoto.innerHTML = '<i class="ph ph-camera-rotate"></i> Trocar Foto';
                                        saveDB();
                                    }
                                }
                            })
                            .catch(err => {
                                alert("Falha ao comunicar com armazenamento da nuvem.");
                                btnAddPhoto.innerHTML = '<i class="ph ph-camera"></i> Adicionar Foto';
                                console.error(err);
                            })
                            .finally(() => {
                                btnAddPhoto.disabled = false;
                            });
                    } else {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            const base64 = ev.target.result;
                            itemEl.dataset.photoBase64 = base64;
                            previewContainer.innerHTML = `<img src="${base64}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border); margin-top: 8px;">`;
                            previewContainer.style.display = 'block';
                            btnAddPhoto.innerHTML = '<i class="ph ph-camera-rotate"></i> Trocar Foto';
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }

            btns.forEach(b => {
                b.addEventListener('click', () => {
                    btns.forEach(x => x.classList.remove('active'));
                    b.classList.add('active');
                    
                    const isBad = b.dataset.val === 'ruim' || b.dataset.val === 'insuficiente';
                    
                    if(isBad) {
                        obsEl.classList.remove('hidden');
                        treatyContainer.classList.remove('hidden');
                        photoLabel.classList.remove('hidden');
                    } else {
                        obsEl.classList.add('hidden');
                        treatyContainer.classList.add('hidden');
                        photoLabel.classList.add('hidden');
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
        deptResponsibleName = respName;

        let allAnswered = true;
        let catResponses = [];
        let errors = [];

        document.querySelectorAll('.audit-item').forEach(itemEl => {
            const activeBtn = itemEl.querySelector('.rating-btn.active');
            if(!activeBtn) { allAnswered = false; return; }

            const val = activeBtn.dataset.val;
            const obs = itemEl.querySelector('.item-obs').value;
            const treaty = itemEl.querySelector('.item-treaty').value;
            const photo64 = itemEl.dataset.photoBase64;
            const isCritico = itemEl.dataset.critical === "true";
            const isBad = val === 'ruim' || val === 'insuficiente';

            if(isBad && !obs) {
                 errors.push(`Justifique o item: ${itemEl.querySelector('.audit-question').innerText.split(' CRÍTICO')[0]}`);
            }
            if(isBad && !treaty) {
                 errors.push(`Selecione a tratativa para o item com nota baixa.`);
            }
            if(isBad && !photo64) {
                 errors.push(`A foto é obrigatória para o item "${questionText}" por ter nota baixa.`);
            }

            catResponses.push({
                itemId: itemEl.dataset.item,
                catId: activeCategoryId,
                value: val,
                observations: obs,
                status_tratativa: treaty,
                photos: photo64 ? [photo64] : [],
                t: Date.now()
            });
        });

        if(!allAnswered) {
            alert('Por favor, responda todos os itens da categoria!');
            return;
        }

        if(errors.length > 0) {
            alert("BLOQUEIO DE CONFORMIDADE:\n\n" + errors.slice(0, 3).join('\n') + (errors.length > 3 ? "\n..." : ""));
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

        if (!currentAudit.id || !currentAudit.date) {
            currentAudit.id = 'aud_' + Date.now();
            currentAudit.date = new Date().toISOString();
        }

        if (currentAudit.departments.length > 0) {
            db.audits.push(JSON.parse(JSON.stringify(currentAudit))); // deep copy
            saveDB(true); // SYNC AUTOMÁTICO AO FINALIZAR
        } else {
            console.warn('Tentativa abortada: auditoria vazia.');
        }

        // Reset Memory
        currentAudit = { id: null, storeId: null, date: null, managerName: '', supervisorName: '', departments: [] };
        
        // Show Report
        const justSaved = db.audits[db.audits.length - 1];
        showReport(justSaved);
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

        // --- POPULATE DECISION MATRIX ---
        const opList = document.getElementById('matrix-operational-list');
        const dirList = document.getElementById('matrix-director-list');
        opList.innerHTML = '';
        dirList.innerHTML = '';

        let opCount = 0;
        let dirCount = 0;

        auditObj.departments.forEach(dept => {
            dept.responses.forEach(resp => {
                if (resp.value === 'ruim' || resp.value === 'insuficiente') {
                    const item = db.checklistItems.find(i => i.id === resp.itemId);
                    const isAlcada = item ? item.eh_alcada : false;

                    const div = document.createElement('div');
                    div.style = "padding: 8px; background: #fff; border: 1px solid #f1f5f9; border-radius: 4px; font-size: 0.8rem; line-height: 1.4;";
                    div.innerHTML = `<strong>${item ? item.question : 'Item'}</strong><br>
                                     <span style="color:#64748b; font-size: 0.7rem;">Status: ${resp.status_tratativa || 'Não Tratado'}</span>`;

                    if (isAlcada) {
                        dirList.appendChild(div);
                        dirCount++;
                    } else {
                        opList.appendChild(div);
                        opCount++;
                    }
                }
            });
        });

        if (opCount === 0) opList.innerHTML = '<p style="text-align:center; color: #cbd5e1; font-size: 0.8rem; margin-top: 20px;">Nenhuma ação operacional pendente</p>';
        if (dirCount === 0) dirList.innerHTML = '<p style="text-align:center; color: #cbd5e1; font-size: 0.8rem; margin-top: 20px;">Nenhuma alçada de diretoria detectada</p>';

        // Mock Notification for Alçada Items
        if (dirCount > 0) {
            console.log("NOTIFICAÇÃO REAL-TIME: Itens de Alçada de Diretoria detectados. Enviando alerta para a Diretoria...");
            // Aqui entraria a integração com Firebase/OneSignal
        }
        
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
            <div class="report-department-block glass" style="margin-top: 24px; border: 1px solid var(--border); border-radius: 8px; overflow: hidden;">
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
                        photoHtml = `<div style="margin-top: 16px; width: 100%; text-align: center;"><img src="${r.photos[0]}" style="max-width: 100%; max-height: 250px; page-break-inside: avoid;; object-fit: contain; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 2px 8px rgba(0,0,0,0.05);"></div>`;
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
                                ${parentResp.photos && parentResp.photos[0] ? `<div style="margin-top: 12px; text-align: center;"><img src="${parentResp.photos[0]}" style="max-width: 100%; max-height: 250px; page-break-inside: avoid; border-radius: 6px; object-fit: contain; border: 1px solid #cbd5e1;"></div>` : ''}
                            </div>
                            <p style="font-size: 0.85rem; color: #1e293b; margin-top:10px; line-height: 1.4;"><i>"${parentResp.observations || 'Sem obs'}"</i></p>
                        </div>
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid ${borderLeftNow}; padding: 12px; border-radius: 8px;">
                            <p style="font-size: 0.75rem; color: #475569; font-weight: 600; text-transform: uppercase; margin-bottom: 10px;">Agora (Auditoria de Retorno)</p>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span class="badge ${scoreNow >= 80 ? 'badge-success' : (scoreNow >= 60 ? 'badge-warning' : 'badge-danger')}">${resp.value.toUpperCase()}</span>
                                ${resp.photos && resp.photos[0] ? `<div style="margin-top: 12px; text-align: center;"><img src="${resp.photos[0]}" style="max-width: 100%; max-height: 250px; page-break-inside: avoid; border-radius: 6px; object-fit: contain; border: 1px solid #cbd5e1;"></div>` : ''}
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
        console.log(`Opening report for audit: ${auditId}`);
        const aud = db.audits.find(a => a.id === auditId);
        if(aud) {
            showReport(aud);
            // Give extra time for DOM and charts to render
            setTimeout(() => {
                const reportContent = document.getElementById('report-view');
                if (reportContent && !reportContent.classList.contains('hidden')) {
                    console.log("Triggering print...");
                    window.print();
                } else {
                    console.warn("Report view not visible, skipping automatic print.");
                }
            }, 1200);
        } else {
            alert("Erro: Auditoria não encontrada no banco de dados.");
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

    let dashChartEvoRanking = null;
    function renderEvolutionRanking() {
        const tbody = document.getElementById('dash-evo-ranking-table-body');
        const leaderDisplay = document.getElementById('evo-leader-display');
        const avgDisplay = document.getElementById('evo-avg-display');
        if (!tbody) return;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const evolutionData = [];
        let totalEvo = 0;
        let countEvo = 0;

        (db.stores || []).forEach(store => {
            const storeAudits = (db.audits || []).filter(a => a && a.storeId === store.id);
            
            const thisMonthAudits = storeAudits.filter(a => {
                const d = new Date(a.date);
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            });

            const prevMonthAudits = storeAudits.filter(a => {
                const d = new Date(a.date);
                return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
            });

            // Inclui a loja se tiver dados em QUALQUER dos meses (não exige os dois)
            if (thisMonthAudits.length > 0 || prevMonthAudits.length > 0) {
                const avgThis = thisMonthAudits.length > 0
                    ? thisMonthAudits.reduce((sum, a) => sum + (a.percentage || 0), 0) / thisMonthAudits.length
                    : null;
                const avgPrev = prevMonthAudits.length > 0
                    ? prevMonthAudits.reduce((sum, a) => sum + (a.percentage || 0), 0) / prevMonthAudits.length
                    : null;

                let evoRate = null;
                if (avgThis !== null && avgPrev !== null && avgPrev > 0) {
                    evoRate = parseFloat(((avgThis - avgPrev) / avgPrev * 100).toFixed(1));
                    totalEvo += evoRate;
                    countEvo++;
                }

                evolutionData.push({
                    name: store.name,
                    currentScore: avgThis !== null ? Math.round(avgThis) : null,
                    prevScore: avgPrev !== null ? Math.round(avgPrev) : null,
                    evoRate: evoRate
                });
            }
        });

        evolutionData.sort((a, b) => {
            if (a.evoRate !== null && b.evoRate !== null) return b.evoRate - a.evoRate;
            if (a.evoRate !== null) return -1;
            if (b.evoRate !== null) return 1;
            return (b.currentScore || 0) - (a.currentScore || 0);
        });

        tbody.innerHTML = '';
        if (evolutionData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted);">Nenhuma auditoria encontrada para o período atual.</td></tr>';
        } else {
            evolutionData.forEach((item, idx) => {
                const tr = document.createElement('tr');
                const evoColor = item.evoRate === null ? 'var(--text-muted)' : (item.evoRate > 0 ? '#10b981' : (item.evoRate < 0 ? 'var(--danger)' : 'var(--text-muted)'));
                const evoIcon  = item.evoRate === null ? 'ph-minus' : (item.evoRate > 0 ? 'ph-trend-up' : (item.evoRate < 0 ? 'ph-trend-down' : 'ph-minus'));
                const evoText  = item.evoRate === null ? '<em style="font-size:0.8rem;">Novo</em>' : `${item.evoRate > 0 ? '+' : ''}${item.evoRate}%`;
                const scoreText = item.currentScore !== null ? `${item.currentScore}%` : `(mês ant. ${item.prevScore}%)`;

                tr.innerHTML = `
                    <td><span class="badge ${idx < 3 ? 'badge-accent' : 'badge-ghost'}">${idx + 1}º</span></td>
                    <td><div style="font-weight:600;">${item.name}</div></td>
                    <td>${scoreText}</td>
                    <td><span style="color:${evoColor}; font-weight:700;"><i class="ph ${evoIcon}"></i> ${evoText}</span></td>
                `;
                tbody.appendChild(tr);
            });
        }

        if (evolutionData.length > 0) {
            if (leaderDisplay) leaderDisplay.innerText = evolutionData[0].name;
            if (avgDisplay) avgDisplay.innerText = (countEvo > 0 ? (totalEvo / countEvo).toFixed(1) : '--') + '%';
        } else {
            if (leaderDisplay) leaderDisplay.innerText = 'Sem dados';
            if (avgDisplay) avgDisplay.innerText = '--';
        }

        const ctxEvo = document.getElementById('chart-evo-comparison');
        if (dashChartEvoRanking) dashChartEvoRanking.destroy();
        if (!ctxEvo) return;

        const monthLabels = [];
        for(let i=5; i>=0; i--) {
            const d = new Date();
            d.setMonth(now.getMonth() - i);
            monthLabels.push(d.toLocaleDateString('pt-BR', { month: 'short' }));
        }

        const datasets = db.stores.slice(0, 5).map((store, idx) => {
            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
            const data = [];
            for(let i=5; i>=0; i--) {
                const target = new Date();
                target.setMonth(now.getMonth() - i);
                const m = target.getMonth();
                const y = target.getFullYear();
                
                const monthAudits = db.audits.filter(a => {
                    const ad = new Date(a.date);
                    return ad.getMonth() === m && ad.getFullYear() === y && a.storeId === store.id;
                });
                if (monthAudits.length > 0) {
                    data.push(monthAudits.reduce((s, a) => s + a.percentage, 0) / monthAudits.length);
                } else {
                    data.push(null);
                }
            }
            return {
                label: store.name,
                data: data,
                borderColor: colors[idx % colors.length],
                backgroundColor: colors[idx % colors.length],
                tension: 0.3, fill: false
            };
        });

        dashChartEvoRanking = new Chart(ctxEvo, {
            type: 'line',
            data: { labels: monthLabels, datasets: datasets },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 10 } } } },
                scales: { y: { beginAtZero: true, max: 100 } }
            }
        });
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
        
        const audits = (db.audits || []).filter(a => a && a.date).sort((a,b) => new Date(b.date) - new Date(a.date));
        
        if (audits.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px; color: var(--text-muted);">Nenhuma auditoria encontrada.</td></tr>';
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
        try {
            if (!confirm('Tem certeza que deseja excluir esta auditoria? Esta ação não pode ser desfeita.')) return;
            
            const initialCount = db.audits.length;
            // Robust comparison: cast both to string and trim to avoid type mismatch
            db.audits = db.audits.filter(a => String(a.id).trim() !== String(id).trim());
            
            if (db.audits.length === initialCount) {
                console.warn("Nenhuma auditoria encontrada para excluir com ID:", id);
                alert("Aviso: Nenhuma auditoria foi removida. O ID pode não coincidir.");
            } else {
                renderAuditHistory(); // Immediate UI feedback
                saveDB();            // Persist changes
                if (typeof renderDashboard === 'function') renderDashboard();
            }
        } catch (err) {
            console.error("Erro ao excluir auditoria:", err);
            alert("Erro ao excluir auditoria. Verifique o console para detalhes.");
        }
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
        if (typeof window.renderAdminCompanies === 'function') window.renderAdminCompanies();
        if (typeof window.renderAdminDepts === 'function') window.renderAdminDepts();
        if (typeof window.renderAdminCategories === 'function') window.renderAdminCategories();
        if (typeof window.renderAdminChecklists === 'function') window.renderAdminChecklists();
        if (typeof renderAdminSettings === 'function') renderAdminSettings();
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
            const tabId = btn.dataset.tab;
            document.getElementById(tabId).classList.add('active');

            if (tabId === 'dash-evo-ranking') {
                renderEvolutionRanking();
            }
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
    const imgbb = document.getElementById('cfg-imgbb-key');
    
    if (svc) svc.value = db.config.emailjs_service || '';
    if (tmp) tmp.value = db.config.emailjs_template || '';
    if (pub) pub.value = db.config.emailjs_public_key || '';

    const syncIdEl = document.getElementById('cfg-sync-id');
    if (syncIdEl) syncIdEl.value = getCloudId();
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

const btnPublish = document.getElementById('btn-publish-cloud');
if (btnPublish) {
    btnPublish.addEventListener('click', () => {
        if (typeof window.publishToCloud === 'function') window.publishToCloud();
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
                
                // --- Smart Jump Logic ---
                // Find all depts and cats with failures (Ruim/Insuficiente)
                const failingDepts = parentAudit.departments.filter(d => 
                    d.responses.some(r => r.value === 'ruim' || r.value === 'insuficiente')
                );

                // Initialize currentAudit
                currentAudit.storeId = selectedStoreId;
                currentAudit.id = 'aud_ret_' + Date.now();
                currentAudit.date = new Date().toISOString();
                currentAudit.departments = [];
                currentAudit.type = 'retorno';
                currentAudit.parentAuditId = parentAuditId;
                currentAudit.managerName = parentAudit.managerName || '';
                currentAudit.supervisorName = parentAudit.supervisorName || '';
                
                document.getElementById('audit-manager-name').value = currentAudit.managerName;
                document.getElementById('audit-supervisor-name').value = currentAudit.supervisorName;

                // UI Reset
                document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
                document.getElementById('audit-flow').classList.remove('hidden');
                document.querySelectorAll('.audit-step').forEach(s => s.classList.add('hidden'));
                
                const store = db.stores.find(s => s.id === selectedStoreId);
                const titleEl = document.getElementById('current-store-title');
                if (titleEl) titleEl.innerText = store ? store.name + " (RETORNO)" : 'Loja (RETORNO)';

                if (failingDepts.length === 1) {
                    const deptId = failingDepts[0].deptId;
                    activeDeptId = deptId;
                    const deptObj = db.departments.find(d => d.id === deptId);
                    if (deptObj) applyTheme(deptObj.color);
                    
                    // Count failing categories in this dept
                    const failingCats = [];
                    const deptResponses = failingDepts[0].responses;
                    deptResponses.forEach(r => {
                        if (r.value === 'ruim' || r.value === 'insuficiente') {
                            const item = db.checklistItems.find(i => i.id === r.itemId);
                            if (item && !failingCats.includes(item.cat_id)) failingCats.push(item.cat_id);
                        }
                    });

                    if (failingCats.length === 1) {
                        // JUMP DIRECTLY to Evaluation (Step 3)
                        activeCategoryId = failingCats[0];
                        const catObj = db.categories.find(c => c.id === activeCategoryId);
                        document.getElementById('current-dept-title').innerText = catObj ? catObj.name : 'Avaliação';
                        
                        document.getElementById('step-3').classList.remove('hidden');
                        updateProgressBar(2);
                        populateCategoriesAndItems(activeCategoryId);
                    } else {
                        // JUMP to Category Selection (Step 2.5)
                        document.getElementById('cat-selection-store-dept').innerText = deptObj ? deptObj.name : 'Departamento';
                        document.getElementById('step-cat-selection').classList.remove('hidden');
                        updateProgressBar(1.5);
                        populateCategoriesSelection(deptId);
                    }
                } else {
                    // Standard Jump to Dept Selection (Step 2)
                    document.getElementById('step-2').classList.remove('hidden');
                    updateProgressBar(1);
                    if (typeof populateDepts === 'function') populateDepts();
                }
            }
        });
    });
}


    // --- Backup & Migração de Dados ---
        const btnImportDb = document.getElementById('btn-import-db');
        const dbFileInput = document.getElementById('db-file-input');
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
            reader.onload = async (e) => {
                try {
                    const jsonStr = e.target.result;
                    // Validate JSON
                    const parsedData = JSON.parse(jsonStr);
                    
                    // Simple logic validation to ensure it's AuditAí DB
                    if (parsedData && Array.isArray(parsedData.users) && Array.isArray(parsedData.audits)) {
                        db = parsedData;
                        await saveDB(true); // Persist local and Sync to Cloud
                        alert('Banco de Dados importado e sincronizado com a nuvem com sucesso! O sistema será reiniciado.');
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

    // 3. Sistema Anti-Debugger (Desativado para Estabilidade)
    // Monitoramento básico removido para evitar congelamento.
    
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
    await loadDB();
    updateAuthUI();
});
