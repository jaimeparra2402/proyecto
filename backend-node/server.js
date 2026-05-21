const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    status: "online",
    message: 'Backend Node (TRWM) funcionando correctamente v1.0.1' 
  });
});

app.listen(PORT, () => console.log('Servidor Node corriendo en puerto ' + PORT));