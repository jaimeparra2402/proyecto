package es.ual.backend_java.Corba.corba;


/**
* com/proyecto/corba/Noticia.java .
* Error!  A message was requested which does not exist.  The messages file does not contain the key: toJavaProlog1
* Error!  A message was requested which does not exist.  The messages file does not contain the key: toJavaProlog2
* domingo, 31 de mayo de 2026, 14:18:31 (hora de verano de Europa central)
*/

public final class Noticia implements org.omg.CORBA.portable.IDLEntity
{
  public String id = null;
  public String jugadorId = null;
  public String titulo = null;
  public String cuerpo = null;
  public String fechaCreacion = null;

  public Noticia ()
  {
  } // ctor

  public Noticia (String _id, String _jugadorId, String _titulo, String _cuerpo, String _fechaCreacion)
  {
    id = _id;
    jugadorId = _jugadorId;
    titulo = _titulo;
    cuerpo = _cuerpo;
    fechaCreacion = _fechaCreacion;
  } // ctor

} // class Noticia
