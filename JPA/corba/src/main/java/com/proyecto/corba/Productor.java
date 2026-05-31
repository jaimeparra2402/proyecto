package com.proyecto.corba;

import org.omg.CORBA.ORB;
import org.omg.CosNaming.NameComponent;
import org.omg.CosNaming.NamingContextExt;
import org.omg.CosNaming.NamingContextExtHelper;

public class Productor {

    public static void main(String[] args) throws Exception {
        ORB orb = ORB.init(args, null);

        org.omg.CORBA.Object objRef = orb.resolve_initial_references("NameService");
        NamingContextExt ncRef = NamingContextExtHelper.narrow(objRef);

        org.omg.CORBA.Object obj = ncRef.resolve_str("ServicioNoticias");
        ServicioNoticias servicio = ServicioNoticiasHelper.narrow(obj);

        Noticia noticia = new Noticia(
            "1",
            "jugador-123",
            "Gran actuación",
            "El jugador marcó 3 goles en el partido",
            "2025-05-31"
        );

        servicio.publicarNoticia(noticia);
        System.out.println("Noticia enviada: " + noticia.titulo);

        orb.destroy();
    }
}