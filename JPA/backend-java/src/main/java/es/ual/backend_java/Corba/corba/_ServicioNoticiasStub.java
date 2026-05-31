package es.ual.backend_java.Corba.corba;

/**
* es/ual/backend_java/Corba/corba/_ServicioNoticiasStub.java .
* Corregido para el nuevo paquete del backend de Java 17.
*/

public class _ServicioNoticiasStub extends org.omg.CORBA.portable.ObjectImpl implements es.ual.backend_java.Corba.corba.ServicioNoticias
{

  public void publicarNoticia (es.ual.backend_java.Corba.corba.Noticia noticia)
  {
            org.omg.CORBA.portable.InputStream $in = null;
            try {
                org.omg.CORBA.portable.OutputStream $out = _request ("publicarNoticia", true);
                es.ual.backend_java.Corba.corba.NoticiaHelper.write ($out, noticia);
                $in = _invoke ($out);
                return;
            } catch (org.omg.CORBA.portable.ApplicationException $ex) {
                $in = $ex.getInputStream ();
                String _id = $ex.getId ();
                throw new org.omg.CORBA.MARSHAL (_id);
            } catch (org.omg.CORBA.portable.RemarshalException $rm) {
                publicarNoticia (noticia        );
            } finally {
                _releaseReply ($in);
            }
  } // publicarNoticia

  public es.ual.backend_java.Corba.corba.Noticia obtenerNoticia (String id)
  {
            org.omg.CORBA.portable.InputStream $in = null;
            try {
                org.omg.CORBA.portable.OutputStream $out = _request ("obtenerNoticia", true);
                $out.write_string (id);
                $in = _invoke ($out);
                es.ual.backend_java.Corba.corba.Noticia $result = es.ual.backend_java.Corba.corba.NoticiaHelper.read ($in);
                return $result;
            } catch (org.omg.CORBA.portable.ApplicationException $ex) {
                $in = $ex.getInputStream ();
                String _id = $ex.getId ();
                throw new org.omg.CORBA.MARSHAL (_id);
            } catch (org.omg.CORBA.portable.RemarshalException $rm) {
                return obtenerNoticia (id        );
            } finally {
                _releaseReply ($in);
            }
  } // obtenerNoticia

  // Type-specific CORBA::Object operations
  private static String[] __ids = {
    "IDL:com/proyecto/corba/ServicioNoticias:1.0"};

  public String[] _ids ()
  {
    return (String[])__ids.clone ();
  }

  private void readObject (java.io.ObjectInputStream s) throws java.io.IOException
  {
     String str = s.readUTF ();
     String[] args = null;
     java.util.Properties props = null;
     org.omg.CORBA.Object obj = org.omg.CORBA.ORB.init (args, props).string_to_object (str);
     org.omg.CORBA.portable.Delegate delegate = ((org.omg.CORBA.portable.ObjectImpl) obj)._get_delegate ();
     _set_delegate (delegate);
  }

  private void writeObject (java.io.ObjectOutputStream s) throws java.io.IOException
  {
     String[] args = null;
     java.util.Properties props = null;
     String str = org.omg.CORBA.ORB.init (args, props).object_to_string (this);
     s.writeUTF (str);
  }
} // class _ServicioNoticiasStub