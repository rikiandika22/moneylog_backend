const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "MoneyLog API",
    description: "Dokumentasi API untuk aplikasi MoneyLog, yaitu backend pencatatan pemasukan dan pengeluaran mahasiswa dengan fitur autentikasi JWT, CRUD transaksi, dan summary saldo.",
    version: "1.0.0"
  },
  servers: [
    {
      url: "http://localhost:5001"
    },
    {
      url: "https://moneylog-backend-2p7qmnn11.vercel.app"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Registrasi user baru",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Registrasi berhasil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        name: { type: "string" },
                        email: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/auth/login": {
      post: {
        summary: "Login user dan mendapatkan token JWT",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Login berhasil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    token: { type: "string" },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        name: { type: "string" },
                        email: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/auth/profile": {
      get: {
        summary: "Mengambil data profile user yang sedang login",
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Profile berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        name: { type: "string" },
                        email: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/transactions": {
      post: {
        summary: "Menambahkan transaksi baru milik user yang sedang login",
        tags: ["Transactions"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  amount: { type: "integer" },
                  type: { type: "string", enum: ["income", "expense"] },
                  category: { type: "string" },
                  date: { type: "string", format: "date" },
                  note: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Transaksi berhasil ditambahkan" }
        }
      },
      get: {
        summary: "Mengambil semua transaksi milik user yang sedang login",
        tags: ["Transactions"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Daftar transaksi" }
        }
      }
    },
    "/api/transactions/{id}": {
      get: {
        summary: "Mengambil detail transaksi berdasarkan id",
        tags: ["Transactions"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          "200": { description: "Detail transaksi" }
        }
      },
      put: {
        summary: "Mengubah data transaksi berdasarkan id",
        tags: ["Transactions"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  amount: { type: "integer" },
                  type: { type: "string", enum: ["income", "expense"] },
                  category: { type: "string" },
                  date: { type: "string", format: "date" },
                  note: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Transaksi berhasil diperbarui" }
        }
      },
      delete: {
        summary: "Menghapus data transaksi berdasarkan id",
        tags: ["Transactions"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          "200": { description: "Transaksi berhasil dihapus" }
        }
      }
    },
    "/api/summary": {
      get: {
        summary: "Mengambil ringkasan keuangan user yang sedang login",
        tags: ["Summary"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Summary berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        totalIncome: { type: "integer" },
                        totalExpense: { type: "integer" },
                        balance: { type: "integer" },
                        totalTransactions: { type: "integer" },
                        totalIncomeTransactions: { type: "integer" },
                        totalExpenseTransactions: { type: "integer" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = swaggerDocument;
