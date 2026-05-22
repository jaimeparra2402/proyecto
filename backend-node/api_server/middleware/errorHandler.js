const errorHandler = (err, req, res, next) => {
  console.error('💥 Error interceptado:', err.stack);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(el => el.message);
    return res.status(400).json({
      status: 'fail',
      message: 'Error de validación en los datos',
      errors: messages
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'fail',
      message: `Formato de ID inválido: ${err.value}`
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      status: 'fail',
      message: `El campo [${field}] ya está registrado en el sistema.`
    });
  }

  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Ocurrió un error interno en el servidor'
  });
};

module.exports = errorHandler;