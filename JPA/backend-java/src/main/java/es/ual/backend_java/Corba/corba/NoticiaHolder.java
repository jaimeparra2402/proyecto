package es.ual.backend_java.Corba.corba;

/**
* com/proyecto/corba/NoticiaHolder.java .
* Error!  A message was requested which does not exist.  The messages file does not contain the key: toJavaProlog1
* Error!  A message was requested which does not exist.  The messages file does not contain the key: toJavaProlog2
* domingo, 31 de mayo de 2026, 14:18:31 (hora de verano de Europa central)
*/

public final class NoticiaHolder implements org.omg.CORBA.portable.Streamable
{
  public es.ual.backend_java.Corba.corba.Noticia value = null;

  public NoticiaHolder ()
  {
  }

  public NoticiaHolder (es.ual.backend_java.Corba.corba.Noticia initialValue)
  {
    value = initialValue;
  }

  public void _read (org.omg.CORBA.portable.InputStream i)
  {
    value = es.ual.backend_java.Corba.corba.NoticiaHelper.read (i);
  }

  public void _write (org.omg.CORBA.portable.OutputStream o)
  {
	  es.ual.backend_java.Corba.corba.NoticiaHelper.write (o, value);
  }

  public org.omg.CORBA.TypeCode _type ()
  {
    return es.ual.backend_java.Corba.corba.NoticiaHelper.type ();
  }

}
