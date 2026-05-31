package es.ual.backend_java.Corba.corba;


/**
* com/proyecto/corba/ServicioNoticiasOperations.java .
* Error!  A message was requested which does not exist.  The messages file does not contain the key: toJavaProlog1
* Error!  A message was requested which does not exist.  The messages file does not contain the key: toJavaProlog2
* domingo, 31 de mayo de 2026, 14:18:31 (hora de verano de Europa central)
*/

public interface ServicioNoticiasOperations 
{
  void publicarNoticia (es.ual.backend_java.Corba.corba.Noticia noticia);
  es.ual.backend_java.Corba.corba.Noticia obtenerNoticia (String id);
} // interface ServicioNoticiasOperations
