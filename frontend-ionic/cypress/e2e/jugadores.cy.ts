describe('Suite Completa de Pruebas E2E - Sistema de Jugadores', () => {
  
  beforeEach(() => {
    // Ajusta la URL base según tu entorno de desarrollo
    cy.visit('http://localhost:8100/landing');
  });

  // ==========================================
  // 1. FUNCIONALIDAD DE AUTENTICACIÓN (Rúbrica)
  // ==========================================
  context('Módulo de Autenticación', () => {
    
    it('Debería registrar un nuevo usuario con éxito', () => {
      cy.visit('/register');
      cy.get('ion-input[name="username"]').type('TestPlayer');
      cy.get('ion-input[type="email"]').type('cypress_test@correo.com');
      cy.get('ion-input[type="password"]').type('passwordSeguro123');
      cy.get('ion-button.register-submit').click();

      // Verificación de redirección post-registro
      cy.url().should('not.include', '/register');
    });

    it('Debería iniciar sesión correctamente con credenciales válidas', () => {
      cy.visit('/login');
      cy.get('ion-input[type="email"]').type('cypress_test@correo.com');
      cy.get('ion-input[type="password"]').type('passwordSeguro123');
      cy.get('ion-button.login-btn').click();
      
      // Verifica el acceso a la zona privada y el estado del Header Component
      cy.url().should('include', '/player-list');
      cy.get('app-header').should('contain', 'cypress_test');
    });

    it('Debería limpiar los datos visuales del usuario al salir a la landing', () => {
      // Flujo de cierre de sesión visual / limpieza de URL
      cy.visit('/player-list');
      cy.visit('/landing'); 
      
      // El header forzado en la landing debe mostrar el botón público de login
      cy.get('app-header').shadow().find('.login-btn').should('be.visible');
      cy.get('app-header').shadow().find('.user-info-btn').should('not.exist');
    });
  });

  // ==========================================
  // 2. CRUD DE JUGADORES (Componente Stencil)
  // ==========================================
  context('Módulo CRUD - Jugadores', () => {
    
    beforeEach(() => {
      // Inyección de sesión o navegación directa simulando rol Admin
      cy.visit('/player-list');
    });

    it('[C] - Debería insertar un nuevo jugador desde el formulario', () => {
      cy.visit('/add-player');
      cy.get('ion-input[name="name"]').type('Luka Modric');
      cy.get('ion-input[name="team"]').type('Real Madrid');
      cy.get('ion-input[name="league"]').type('LaLiga');
      
      // Interacción con selectores nativos de Ionic
      cy.get('ion-select[name="position"]').click();
      cy.get('ion-select-option').contains('Midfielder').click();
      
      cy.get('ion-button[type="submit"]').click();

      // Comprobación de retorno y renderizado del Web Component de Stencil
      cy.url().should('include', '/player-list');
      cy.get('player-row-item').should('have.attr', 'name', 'Luka Modric');
    });

    it('[R] - Debería buscar y filtrar un elemento en la lista', () => {
      cy.get('ion-searchbar').type('Modric');
      
      // El buscador debe aislar estructuralmente el componente Stencil correcto
      cy.get('player-row-item').should('have.length', 1);
      cy.get('player-row-item').should('have.attr', 'name', 'Luka Modric');
    });

    it('[U] - Debería editar las propiedades de un jugador existente', () => {
      // Filtramos para asegurar que hacemos click en el correcto
      cy.get('ion-searchbar').type('Luka Modric');
      
      // Accedemos a los eventos del Shadow DOM del componente Stencil para editar
      cy.get('player-row-item').shadow().find('.btn-edit').click();
      
      cy.url().should('include', '/edit-player');
      cy.get('ion-input[name="team"]').clear().type('Modric Legend Team');
      cy.get('ion-button.save-btn').click();
      
      cy.url().should('include', '/player-list');
      cy.get('player-row-item').should('have.attr', 'team', 'Modric Legend Team');
    });

    it('[D] - Debería eliminar un jugador de la lista', () => {
      cy.get('ion-searchbar').type('Luka Modric');
      
      // Disparamos la acción de borrado desde el Web Component
      cy.get('player-row-item').shadow().find('.btn-delete').click();
      
      // Si configuraste un AlertController de confirmación de Ionic:
      cy.get('ion-alert').should('be.visible');
      cy.get('button').contains('Confirmar').click();

      // El elemento ya no debe existir en el DOM
      cy.get('player-row-item').should('not.exist');
    });
  });

  // ==========================================
  // 3. CRUD DE COMENTARIOS Y VALORACIONES
  // ==========================================
  context('Módulo CRUD - Comentarios y Valoraciones', () => {

    it('[C] - Debería publicar un nuevo comentario con valoración por estrellas', () => {
      // Entramos al detalle de cualquier jugador para ver sus comentarios
      cy.visit('/player-detail/1'); 
      
      cy.get('ion-textarea[name="commentText"]').type('Increíble rendimiento esta temporada, ¡un crack!');
      
      // Seleccionamos la valoración de estrellas (ej: 4 estrellas)
      cy.get('.star-rating-input ion-icon').eq(3).click(); 
      
      cy.get('ion-button.submit-comment').click();

      // Verificamos que aparezca listado dinámicamente en el contenedor nativo
      cy.get('.comment-text').first().should('contain.text', 'Increíble rendimiento esta temporada');
      cy.get('.stars ion-icon[name="star"]').should('have.length', 4);
    });

    it('[D] - Debería permitir al administrador eliminar un comentario ofensivo o erróneo', () => {
      cy.visit('/player-detail/1');
      
      // Buscamos el bloque del comentario y hacemos click en su botón de borrar (exclusivo Admin)
      cy.get('.ion-text-wrap').contains('Increíble rendimiento esta temporada')
        .parents('ion-item')
        .find('.delete-comment-btn').click();

      cy.get('.comment-text').should('not.contain.text', 'Increíble rendimiento esta temporada');
    });
  });

});