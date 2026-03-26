// TODO: Implement
// Partners page: Static constellation with filters
// partnersListData is injected by the EJS template as a global variable
(function() {
    if (typeof partnersListData === 'undefined' || !partnersListData.length) return;

    function initStaticConstellation() {
        const partnersData = partnersListData;

        // Elementos del DOM
        const container = document.getElementById('constellationContainer');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const filterStats = document.getElementById('filterStats');
        const visibleCount = document.getElementById('visibleCount');
        const totalCount = document.getElementById('totalCount');
        
        // Variables del sistema
        let nodes = [];
        let connections = [];
        let currentFilter = 'all';
        const containerRect = container.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        const radius = Math.min(containerRect.width, containerRect.height) * 0.35;
        
        // Posiciones predeterminadas para una constelación estática
        const positions = [
            { x: 0.8, y: 0.2 },   // Posición 1
            { x: 0.9, y: 0.4 },   // Posición 2
            { x: 0.7, y: 0.6 },   // Posición 3
            { x: 0.4, y: 0.8 },   // Posición 4
            { x: 0.2, y: 0.7 },   // Posición 5
            { x: 0.1, y: 0.4 },   // Posición 6
            { x: 0.3, y: 0.2 },   // Posición 7
            { x: 0.5, y: 0.1 },   // Posición 8
            { x: 0.6, y: 0.3 },   // Posición 9
            { x: 0.7, y: 0.5 },   // Posición 10
            { x: 0.4, y: 0.4 },   // Posición 11
            { x: 0.3, y: 0.6 },   // Posición 12
            { x: 0.5, y: 0.7 }    // Posición 13
        ];
        
        // Crear nodos
        partnersData.forEach((partner, index) => {
            const node = document.createElement('div');
            node.className = 'constellation-node';
            node.dataset.index = index;
            node.dataset.category = partner.category;
            node.dataset.name = partner.name;
            
            // Posición aleatoria pero balanceada
            const pos = positions[index % positions.length];
            const x = containerRect.width * pos.x - 70;
            const y = containerRect.height * pos.y - 70;
            
            // Asegurar que esté dentro del contenedor
            const safeX = Math.max(20, Math.min(containerRect.width - 160, x));
            const safeY = Math.max(20, Math.min(containerRect.height - 160, y));
            
            node.style.left = `${safeX}px`;
            node.style.top = `${safeY}px`;
            
            // Crear imagen
            const img = document.createElement('img');
            img.src = partner.logo;
            img.alt = partner.name;
            
            node.appendChild(img);
            container.appendChild(node);
            
            // Guardar información del nodo
            nodes.push({
                element: node,
                x: safeX,
                y: safeY,
                name: partner.name,
                category: partner.category
            });
            
            // Hover effect
            node.addEventListener('mouseenter', () => {
                node.classList.add('active');
                highlightConnections(node);
            });
            
            node.addEventListener('mouseleave', () => {
                node.classList.remove('active');
                unhighlightConnections();
            });
        });
        
        // Crear conexiones entre nodos
        createConnections();
        
        // Actualizar estadísticas
        totalCount.textContent = nodes.length;
        updateFilterStats();
        
        // Configurar filtros
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Actualizar botones activos
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Aplicar filtro
                applyFilter(filter);
                currentFilter = filter;
                
                // Actualizar estadísticas
                updateFilterStats();
            });
        });
        
        // Funciones del sistema
        function createConnections() {
            // Limpiar conexiones anteriores
            document.querySelectorAll('.connection-line').forEach(line => line.remove());
            connections = [];
            
            // Crear conexiones estratégicas
            const connectionRules = {
                'social': ['media', 'tech'],
                'media': ['social', 'tech'],
                'tech': ['sports', 'social'],
                'sports': ['media', 'tech']
            };
            
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    // Calcular distancia
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Conectar nodos cercanos o con categorías relacionadas
                    const shouldConnect = (
                        distance < 250 || // Nodos cercanos
                        (connectionRules[nodes[i].category] && 
                         connectionRules[nodes[i].category].includes(nodes[j].category)) || // Categorías relacionadas
                        Math.random() > 0.7 // Conexión aleatoria
                    );
                    
                    if (shouldConnect) {
                        const line = document.createElement('div');
                        line.className = 'connection-line';
                        container.appendChild(line);
                        
                        connections.push({
                            element: line,
                            node1: nodes[i],
                            node2: nodes[j]
                        });
                    }
                }
            }
            
            // Actualizar visualización de conexiones
            updateConnections();
        }
        
        function updateConnections() {
            connections.forEach(conn => {
                const dx = conn.node2.x - conn.node1.x;
                const dy = conn.node2.y - conn.node1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                
                conn.element.style.width = `${distance}px`;
                conn.element.style.left = `${conn.node1.x + 70}px`;
                conn.element.style.top = `${conn.node1.y + 70}px`;
                conn.element.style.transform = `rotate(${angle}deg)`;
            });
        }
        
        function applyFilter(filter) {
            nodes.forEach(node => {
                const nodeElement = node.element;
                
                if (filter === 'all' || node.category === filter) {
                    // Mostrar y destacar
                    nodeElement.classList.remove('hidden');
                    nodeElement.classList.add('highlighted');
                } else {
                    // Ocultar
                    nodeElement.classList.add('hidden');
                    nodeElement.classList.remove('highlighted');
                }
            });
            
            // Actualizar conexiones
            updateConnectionVisibility();
        }
        
        function updateConnectionVisibility() {
            connections.forEach(conn => {
                const node1Visible = currentFilter === 'all' || conn.node1.category === currentFilter;
                const node2Visible = currentFilter === 'all' || conn.node2.category === currentFilter;
                
                if (node1Visible && node2Visible) {
                    conn.element.classList.add('active');
                    conn.element.style.opacity = '0.8';
                } else {
                    conn.element.classList.remove('active');
                    conn.element.style.opacity = '0.2';
                }
            });
        }
        
        function highlightConnections(activeNode) {
            connections.forEach(conn => {
                if (conn.node1.element === activeNode || conn.node2.element === activeNode) {
                    conn.element.classList.add('active');
                    conn.element.style.opacity = '1';
                    conn.element.style.zIndex = '10';
                }
            });
        }
        
        function unhighlightConnections() {
            updateConnectionVisibility();
            connections.forEach(conn => {
                conn.element.style.zIndex = '1';
            });
        }
        
        function updateFilterStats() {
            let visibleNodes = 0;
            
            if (currentFilter === 'all') {
                visibleNodes = nodes.length;
            } else {
                visibleNodes = nodes.filter(node => node.category === currentFilter).length;
            }
            
            visibleCount.textContent = visibleNodes;
        }
        
        // Manejar resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Actualizar dimensiones del contenedor
                const newRect = container.getBoundingClientRect();
                
                // Recalcular posiciones relativas
                nodes.forEach((node, index) => {
                    const pos = positions[index % positions.length];
                    const x = newRect.width * pos.x - 70;
                    const y = newRect.height * pos.y - 70;
                    
                    const safeX = Math.max(20, Math.min(newRect.width - 160, x));
                    const safeY = Math.max(20, Math.min(newRect.height - 160, y));
                    
                    node.x = safeX;
                    node.y = safeY;
                    node.element.style.left = `${safeX}px`;
                    node.element.style.top = `${safeY}px`;
                });
                
                // Actualizar conexiones
                updateConnections();
            }, 250);
        });
    }

    // Init after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStaticConstellation);
    } else {
        initStaticConstellation();
    }

    // Re-init on window resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initStaticConstellation, 300);
    });
})();