import { swaggerDocument } from '@/lib/swagger';

describe('Swagger Documentation', () => {
  it('debería tener la estructura correcta de OpenAPI', () => {
    expect(swaggerDocument.openapi).toBe('3.0.0');
    expect(swaggerDocument.info).toBeDefined();
    expect(swaggerDocument.info.title).toBe(
      'Sistema de Gestión de Ingresos y Egresos API'
    );
  });

  it('debería definir todos los endpoints requeridos', () => {
    const paths = swaggerDocument.paths;

    // Verificar que existen los endpoints principales
    expect(paths['/transactions']).toBeDefined();
    expect(paths['/users']).toBeDefined();
    expect(paths['/users/{id}']).toBeDefined();
    expect(paths['/reports']).toBeDefined();
    expect(paths['/reports/csv']).toBeDefined();
  });

  it('debería tener esquemas de seguridad configurados', () => {
    expect(swaggerDocument.components.securitySchemes).toBeDefined();
    expect(swaggerDocument.components.securitySchemes.cookieAuth).toBeDefined();
  });

  it('debería incluir todos los schemas necesarios', () => {
    const schemas = swaggerDocument.components.schemas;

    expect(schemas.Transaction).toBeDefined();
    expect(schemas.User).toBeDefined();
    expect(schemas.Error).toBeDefined();
  });

  it('debería tener tags definidos', () => {
    expect(swaggerDocument.tags).toBeDefined();
    expect(swaggerDocument.tags.length).toBeGreaterThan(0);

    const tagNames = swaggerDocument.tags.map((tag) => tag.name);
    expect(tagNames).toContain('Transactions');
    expect(tagNames).toContain('Users');
    expect(tagNames).toContain('Reports');
  });
});
