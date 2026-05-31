package es.ual.backend_java.Corba;

import org.omg.CORBA.ORB;
import org.omg.CosNaming.NamingContextExt;
import org.omg.CosNaming.NamingContextExtHelper;

import es.ual.backend_java.Corba.corba.ServicioNoticias;
import es.ual.backend_java.Corba.corba.ServicioNoticiasHelper;
import es.ual.backend_java.Corba.corba.Noticia; 

import java.util.Properties;

public class CorbaClient {

    private ServicioNoticias servicio;

    public CorbaClient() {
        try {
            Properties props = new Properties();
            props.put("org.omg.CORBA.ORBInitialPort", "1060");
            props.put("org.omg.CORBA.ORBInitialHost", "localhost");

            ORB orb = ORB.init(new String[]{}, props);

            org.omg.CORBA.Object objRef = orb.resolve_initial_references("NameService");
            NamingContextExt ncRef = NamingContextExtHelper.narrow(objRef);

            servicio = ServicioNoticiasHelper.narrow(ncRef.resolve_str("ServicioNoticias"));

        } catch (Exception e) {
            throw new RuntimeException("Error conectando al servidor CORBA", e);
        }
    }

    public void publicar(String idJugador, String titulo, String noticia) {
        if (servicio == null) {
            throw new IllegalStateException("El servicio CORBA no está inicializado");
        }

        Noticia n = new Noticia();
        n.id = idJugador;
        n.titulo = titulo;
        n.cuerpo = noticia;
        n.fechaCreacion = java.time.LocalDateTime.now().toString();

        servicio.publicarNoticia(n);
    }

    public Noticia obtener(String id) {
        if (servicio == null) {
            throw new IllegalStateException("El servicio CORBA no está inicializado");
        }
        return servicio.obtenerNoticia(id);
    }
}