

const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack); 
  
    res.status(err.status || 500); 
    res.json({
      message: err.message || 'An unexpected error occurred',
      
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  
  module.exports = errorMiddleware;
  