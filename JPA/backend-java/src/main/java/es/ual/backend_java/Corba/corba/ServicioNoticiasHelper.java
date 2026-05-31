package es.ual.backend_java.Corba.corba;


/**
* com/proyecto/corba/ServicioNoticiasHelper.java .
* Error!  A message was requested which does not exist.  The messages file does not contain the key: toJavaProlog1
* Error!  A message was requested which does not exist.  The messages file does not contain the key: toJavaProlog2
* domingo, 31 de mayo de 2026, 14:18:31 (hora de verano de Europa central)
*/

abstract public class ServicioNoticiasHelper
{
  private static String  _id = "IDL:com/proyecto/corba/ServicioNoticias:1.0";

  public static void insert (org.omg.CORBA.Any a, es.ual.backend_java.Corba.corba.ServicioNoticias that)
  {
    org.omg.CORBA.portable.OutputStream out = a.create_output_stream ();
    a.type (type ());
    write (out, that);
    a.read_value (out.create_input_stream (), type ());
  }

  public static es.ual.backend_java.Corba.corba.ServicioNoticias extract (org.omg.CORBA.Any a)
  {
    return read (a.create_input_stream ());
  }

  private static org.omg.CORBA.TypeCode __typeCode = null;
  synchronized public static org.omg.CORBA.TypeCode type ()
  {
    if (__typeCode == null)
    {
      __typeCode = org.omg.CORBA.ORB.init ().create_interface_tc (es.ual.backend_java.Corba.corba.ServicioNoticiasHelper.id (), "ServicioNoticias");
    }
    return __typeCode;
  }

  public static String id ()
  {
    return _id;
  }

  public static es.ual.backend_java.Corba.corba.ServicioNoticias read (org.omg.CORBA.portable.InputStream istream)
  {
    return narrow (istream.read_Object (_ServicioNoticiasStub.class));
  }

  public static void write (org.omg.CORBA.portable.OutputStream ostream, es.ual.backend_java.Corba.corba.ServicioNoticias value)
  {
    ostream.write_Object ((org.omg.CORBA.Object) value);
  }

  public static es.ual.backend_java.Corba.corba.ServicioNoticias narrow (org.omg.CORBA.Object obj)
  {
    if (obj == null)
      return null;
    else if (obj instanceof es.ual.backend_java.Corba.corba.ServicioNoticias)
      return (es.ual.backend_java.Corba.corba.ServicioNoticias)obj;
    else if (!obj._is_a (id ()))
      throw new org.omg.CORBA.BAD_PARAM ();
    else
    {
      org.omg.CORBA.portable.Delegate delegate = ((org.omg.CORBA.portable.ObjectImpl)obj)._get_delegate ();
      es.ual.backend_java.Corba.corba._ServicioNoticiasStub stub = new es.ual.backend_java.Corba.corba._ServicioNoticiasStub ();
      stub._set_delegate(delegate);
      return stub;
    }
  }

  public static es.ual.backend_java.Corba.corba.ServicioNoticias unchecked_narrow (org.omg.CORBA.Object obj)
  {
    if (obj == null)
      return null;
    else if (obj instanceof es.ual.backend_java.Corba.corba.ServicioNoticias)
      return (es.ual.backend_java.Corba.corba.ServicioNoticias)obj;
    else
    {
      org.omg.CORBA.portable.Delegate delegate = ((org.omg.CORBA.portable.ObjectImpl)obj)._get_delegate ();
      es.ual.backend_java.Corba.corba._ServicioNoticiasStub stub = new es.ual.backend_java.Corba.corba._ServicioNoticiasStub ();
      stub._set_delegate(delegate);
      return stub;
    }
  }

}
