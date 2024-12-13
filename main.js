document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    const exportBtn = document.getElementById('exportBtn');
    const sections = document.querySelectorAll('.canvas-section');

    const DEFAULT_PASSWORD = "12345"; // Senha padrão

    // Salvar dados da tela com nome da versão
    function saveCanvas() {
        const versionName = prompt('Digite um nome para esta versão:');
        if (!versionName) {
            alert('Ação cancelada. Nenhum nome fornecido.');
            return;
        }

        const canvasData = {
            timestamp: new Date().toISOString(),
            password: DEFAULT_PASSWORD,
            versionName,
            sections: {}
        };

        sections.forEach(section => {
            const id = section.id;
            const content = section.querySelector('.content').innerHTML;
            canvasData.sections[id] = content;
        });

        let savedVersions = JSON.parse(localStorage.getItem('businessCanvasVersions')) || [];
        savedVersions.push(canvasData);
        localStorage.setItem('businessCanvasVersions', JSON.stringify(savedVersions));

        alert('Canvas salvo com sucesso!');
    }

    // Carregar dados da tela
    function loadCanvas() {
        const savedVersions = JSON.parse(localStorage.getItem('businessCanvasVersions')) || [];

        if (savedVersions.length === 0) {
            alert('Nenhuma versão salva encontrada!');
            return;
        }

        const versionOptions = savedVersions.map((version, index) => {
            return `${index + 1}: ${version.versionName} (Salvo em ${new Date(version.timestamp).toLocaleString()})`;
        }).join('\n');

        const selectedVersion = prompt(`Escolha a versão para carregar:\n${versionOptions}`);
        const versionIndex = parseInt(selectedVersion, 10) - 1;

        if (isNaN(versionIndex) || versionIndex < 0 || versionIndex >= savedVersions.length) {
            alert('Seleção inválida!');
            return;
        }

        const chosenVersion = savedVersions[versionIndex];

        sections.forEach(section => {
            const id = section.id;
            if (chosenVersion.sections[id]) {
                section.querySelector('.content').innerHTML = chosenVersion.sections[id];
            }
        });

        alert(`Canvas carregado com sucesso: ${chosenVersion.versionName}`);
    }

    // Exportar como PDF (versão simplificada)
    function exportCanvas() {
        window.print();
    }

    // Adicionar efeito de foco às seções
    sections.forEach(section => {
        section.addEventListener('mouseenter', () => {
            section.style.transform = 'scale(1.02)';
        });

        section.addEventListener('mouseleave', () => {
            section.style.transform = 'scale(1)';
        });
    });

    // Event listeners
    saveBtn.addEventListener('click', saveCanvas);
    loadBtn.addEventListener('click', loadCanvas);
    exportBtn.addEventListener('click', exportCanvas);
});
