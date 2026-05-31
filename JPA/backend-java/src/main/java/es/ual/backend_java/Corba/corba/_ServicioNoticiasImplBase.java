package es.ual.backend_java.Corba.corba;


/**
* com/proyecto/corba/_ServicioNoticiasImplBase.java .
* Error!  A message was requested which does not exist.  The messages file does not contain the key: toJavaProlog1
* Error!  A message was requested which does not exist.  The messages file does not contain the key: toJavaProlog2
* domingo, 31 de mayo de 2026, 14:18:31 (hora de verano de Europa central)
*/

public abstract class _ServicioNoticiasImplBase extends org.omg.CORBA.portable.ObjectImpl
                implements es.ual.backend_java.Corba.corba.ServicioNoticias, org.omg.CORBA.portable.InvokeHandler
{

  // Constructors
  public _ServicioNoticiasImplBase ()
  {
  }

  private static java.util.Map<String,Integer> _methods = new java.util.HashMap<String,Integer> ();
  static
  {
    _methods.put ("publicarNoticia", 0);
    _methods.put ("obtenerNoticia", 1);
  }

  public org.omg.CORBA.portable.OutputStream _invoke (String $method,
                                org.omg.CORBA.portable.InputStream in,
                                org.omg.CORBA.portable.ResponseHandler $rh)
  {
    org.omg.CORBA.portable.OutputStream out = null;
    java.lang.Integer __method = _methods.get($method);
    if (__method == null)
      throw new org.omg.CORBA.BAD_OPERATION (0, org.omg.CORBA.CompletionStatus.COMPLETED_MAYBE);

    switch (__method.intValue ())
    {
       case 0:  // com/proyecto/corba/ServicioNoticias/publicarNoticia
       {
    	   es.ual.backend_java.Corba.corba.Noticia noticia = es.ual.backend_java.Corba.corba.NoticiaHelper.read (in);
         this.publicarNoticia (noticia);
         out = $rh.createReply();
         break;
       }

       case 1:  // com/proyecto/corba/ServicioNoticias/obtenerNoticia
       {
         String id = in.read_string ();
         es.ual.backend_java.Corba.corba.Noticia $result = null;
         $result = this.obtenerNoticia (id);
         out = $rh.createReply();
         es.ual.backend_java.Corba.corba.NoticiaHelper.write (out, $result);
         break;
       }

       default:
         throw new org.omg.CORBA.BAD_OPERATION (0, org.omg.CORBA.CompletionStatus.COMPLETED_MAYBE);
    }

    return out;
  } // _invoke

  // Type-specific CORBA::Object operations
  private static String[] __ids = {
    "IDL:com/proyecto/corba/ServicioNoticias:1.0"};

  public String[] _ids ()
  {
    return (String[])__ids.clone ();
  }


} // class _ServicioNoticiasImplBase
