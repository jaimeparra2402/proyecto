package es.ual.backend_java.Corba.corba;


/**
* com/proyecto/corba/ServicioNoticias_Tie.java .
* Error!  A message was requested which does not exist.  The messages file does not contain the key: toJavaProlog1
* Error!  A message was requested which does not exist.  The messages file does not contain the key: toJavaProlog2
* domingo, 31 de mayo de 2026, 14:18:31 (hora de verano de Europa central)
*/

public class ServicioNoticias_Tie extends _ServicioNoticiasImplBase
{

  // Constructors
  public ServicioNoticias_Tie ()
  {
  }

  public ServicioNoticias_Tie (es.ual.backend_java.Corba.corba.ServicioNoticiasOperations impl)
  {
    super ();
    _impl = impl;
  }

  public void publicarNoticia (es.ual.backend_java.Corba.corba.Noticia noticia)
  {
    _impl.publicarNoticia(noticia);
  } // publicarNoticia

  public es.ual.backend_java.Corba.corba.Noticia obtenerNoticia (String id)
  {
    return _impl.obtenerNoticia(id);
  } // obtenerNoticia

  private es.ual.backend_java.Corba.corba.ServicioNoticiasOperations _impl;

} // class ServicioNoticias_Tie
