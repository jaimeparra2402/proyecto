package es.ual.backend_java.Corba.corba;


/**
* com/proyecto/corba/NoticiaHelper.java .
* Error!  A message was requested which does not exist.  The messages file does not contain the key: toJavaProlog1
* Error!  A message was requested which does not exist.  The messages file does not contain the key: toJavaProlog2
* domingo, 31 de mayo de 2026, 14:18:31 (hora de verano de Europa central)
*/

abstract public class NoticiaHelper
{
  private static String  _id = "IDL:com/proyecto/corba/Noticia/Noticia:1.0";

  public static void insert (org.omg.CORBA.Any a, es.ual.backend_java.Corba.corba.Noticia that)
  {
    org.omg.CORBA.portable.OutputStream out = a.create_output_stream ();
    a.type (type ());
    write (out, that);
    a.read_value (out.create_input_stream (), type ());
  }

  public static es.ual.backend_java.Corba.corba.Noticia extract (org.omg.CORBA.Any a)
  {
    return read (a.create_input_stream ());
  }

  private static org.omg.CORBA.TypeCode __typeCode = null;
  private static boolean __active = false;
  synchronized public static org.omg.CORBA.TypeCode type ()
  {
    if (__typeCode == null)
    {
      synchronized (org.omg.CORBA.TypeCode.class)
      {
        if (__typeCode == null)
        {
          if (__active)
          {
            return org.omg.CORBA.ORB.init().create_recursive_tc ( _id );
          }
          __active = true;
          org.omg.CORBA.StructMember[] _members0 = new org.omg.CORBA.StructMember [5];
          org.omg.CORBA.TypeCode _tcOf_members0 = null;
          _tcOf_members0 = org.omg.CORBA.ORB.init ().create_string_tc (0);
          _members0[0] = new org.omg.CORBA.StructMember (
            "id",
            _tcOf_members0,
            null);
          _tcOf_members0 = org.omg.CORBA.ORB.init ().create_string_tc (0);
          _members0[1] = new org.omg.CORBA.StructMember (
            "jugadorId",
            _tcOf_members0,
            null);
          _tcOf_members0 = org.omg.CORBA.ORB.init ().create_string_tc (0);
          _members0[2] = new org.omg.CORBA.StructMember (
            "titulo",
            _tcOf_members0,
            null);
          _tcOf_members0 = org.omg.CORBA.ORB.init ().create_string_tc (0);
          _members0[3] = new org.omg.CORBA.StructMember (
            "cuerpo",
            _tcOf_members0,
            null);
          _tcOf_members0 = org.omg.CORBA.ORB.init ().create_string_tc (0);
          _members0[4] = new org.omg.CORBA.StructMember (
            "fechaCreacion",
            _tcOf_members0,
            null);
          __typeCode = org.omg.CORBA.ORB.init ().create_struct_tc (es.ual.backend_java.Corba.corba.NoticiaHelper.id (), "Noticia", _members0);
          __active = false;
        }
      }
    }
    return __typeCode;
  }

  public static String id ()
  {
    return _id;
  }

  public static es.ual.backend_java.Corba.corba.Noticia read (org.omg.CORBA.portable.InputStream istream)
  {
	  es.ual.backend_java.Corba.corba.Noticia value = new es.ual.backend_java.Corba.corba.Noticia ();
    value.id = istream.read_string ();
    value.jugadorId = istream.read_string ();
    value.titulo = istream.read_string ();
    value.cuerpo = istream.read_string ();
    value.fechaCreacion = istream.read_string ();
    return value;
  }

  public static void write (org.omg.CORBA.portable.OutputStream ostream, es.ual.backend_java.Corba.corba.Noticia value)
  {
    ostream.write_string (value.id);
    ostream.write_string (value.jugadorId);
    ostream.write_string (value.titulo);
    ostream.write_string (value.cuerpo);
    ostream.write_string (value.fechaCreacion);
  }

}
