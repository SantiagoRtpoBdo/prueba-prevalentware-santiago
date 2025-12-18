/**
 * OpenAPI/Swagger documentation configuration
 */
export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Sistema de Gestión de Ingresos y Egresos API',
    version: '1.0.0',
    description:
      'API REST para la gestión de ingresos, egresos y usuarios con control de acceso basado en roles (RBAC)',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'API Server',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'better-auth.session_token',
      },
    },
    schemas: {
      Transaction: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID único de la transacción',
          },
          concept: {
            type: 'string',
            description: 'Concepto o descripción de la transacción',
          },
          amount: {
            type: 'number',
            format: 'float',
            description: 'Monto de la transacción',
          },
          type: {
            type: 'string',
            enum: ['INCOME', 'EXPENSE'],
            description: 'Tipo de transacción: ingreso o egreso',
          },
          date: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de la transacción',
          },
          userId: {
            type: 'string',
            description: 'ID del usuario que creó la transacción',
          },
          user: {
            $ref: '#/components/schemas/User',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID único del usuario',
          },
          name: {
            type: 'string',
            description: 'Nombre del usuario',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Correo electrónico del usuario',
          },
          phone: {
            type: 'string',
            description: 'Teléfono del usuario',
            nullable: true,
          },
          role: {
            type: 'string',
            enum: ['USER', 'ADMIN'],
            description: 'Rol del usuario',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Mensaje de error',
          },
        },
      },
    },
  },
  security: [
    {
      cookieAuth: [],
    },
  ],
  paths: {
    '/transactions': {
      get: {
        tags: ['Transactions'],
        summary: 'Obtener todas las transacciones',
        description: 'Retorna una lista de todas las transacciones de ingresos y egresos',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de transacciones obtenida exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Transaction',
                  },
                },
              },
            },
          },
          '401': {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Transactions'],
        summary: 'Crear una nueva transacción',
        description: 'Crea un nuevo ingreso o egreso (solo administradores)',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['concept', 'amount', 'type', 'date'],
                properties: {
                  concept: {
                    type: 'string',
                    description: 'Concepto de la transacción',
                    example: 'Venta de producto',
                  },
                  amount: {
                    type: 'number',
                    format: 'float',
                    description: 'Monto',
                    example: 1500.5,
                  },
                  type: {
                    type: 'string',
                    enum: ['INCOME', 'EXPENSE'],
                    description: 'Tipo de transacción',
                    example: 'INCOME',
                  },
                  date: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Fecha de la transacción',
                    example: '2025-12-18T12:00:00Z',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Transacción creada exitosamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Transaction',
                },
              },
            },
          },
          '400': {
            description: 'Datos inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '401': {
            description: 'No autenticado',
          },
          '403': {
            description: 'Acceso denegado - se requiere rol de administrador',
          },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Obtener todos los usuarios',
        description: 'Retorna una lista de todos los usuarios (solo administradores)',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de usuarios obtenida exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
          },
          '401': {
            description: 'No autenticado',
          },
          '403': {
            description: 'Acceso denegado - se requiere rol de administrador',
          },
        },
      },
    },
    '/users/{id}': {
      put: {
        tags: ['Users'],
        summary: 'Actualizar un usuario',
        description: 'Actualiza la información de un usuario (solo administradores)',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del usuario',
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Nombre del usuario',
                    example: 'Juan Pérez',
                  },
                  role: {
                    type: 'string',
                    enum: ['USER', 'ADMIN'],
                    description: 'Rol del usuario',
                    example: 'ADMIN',
                  },
                  phone: {
                    type: 'string',
                    description: 'Teléfono del usuario',
                    example: '+57 300 123 4567',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Usuario actualizado exitosamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '400': {
            description: 'Datos inválidos',
          },
          '401': {
            description: 'No autenticado',
          },
          '403': {
            description: 'Acceso denegado - se requiere rol de administrador',
          },
          '404': {
            description: 'Usuario no encontrado',
          },
        },
      },
    },
    '/reports': {
      get: {
        tags: ['Reports'],
        summary: 'Obtener datos de reporte',
        description:
          'Retorna datos para generar reportes financieros (solo administradores)',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'Datos de reporte obtenidos exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    balance: {
                      type: 'number',
                      description: 'Saldo actual (ingresos - egresos)',
                    },
                    totalIncome: {
                      type: 'number',
                      description: 'Total de ingresos',
                    },
                    totalExpense: {
                      type: 'number',
                      description: 'Total de egresos',
                    },
                    monthlyData: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          month: {
                            type: 'string',
                            description: 'Mes',
                          },
                          income: {
                            type: 'number',
                            description: 'Ingresos del mes',
                          },
                          expense: {
                            type: 'number',
                            description: 'Egresos del mes',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'No autenticado',
          },
          '403': {
            description: 'Acceso denegado - se requiere rol de administrador',
          },
        },
      },
    },
    '/reports/csv': {
      get: {
        tags: ['Reports'],
        summary: 'Descargar reporte en CSV',
        description: 'Descarga un archivo CSV con todas las transacciones (solo administradores)',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'Archivo CSV generado exitosamente',
            content: {
              'text/csv': {
                schema: {
                  type: 'string',
                  format: 'binary',
                },
              },
            },
          },
          '401': {
            description: 'No autenticado',
          },
          '403': {
            description: 'Acceso denegado - se requiere rol de administrador',
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Transactions',
      description: 'Endpoints para gestión de ingresos y egresos',
    },
    {
      name: 'Users',
      description: 'Endpoints para gestión de usuarios (solo administradores)',
    },
    {
      name: 'Reports',
      description: 'Endpoints para generación de reportes (solo administradores)',
    },
  ],
};
