package com.proyecto.corba;

import org.omg.CORBA.ORB;
import org.omg.CosNaming.NamingContextExt;
import org.omg.CosNaming.NamingContextExtHelper;

public class Consumidor {

    public static void main(String[] args) throws Exception {
        ORB orb = ORB.init(args, null);

        org.omg.CORBA.Object objRef = orb.resolve_initial_references("NameService");
        NamingContextExt ncRef = NamingContextExtHelper.narrow(objRef);

        org.omg.CORBA.Object obj = ncRef.resolve_str("ServicioNoticias");
        ServicioNoticias servicio = ServicioNoticiasHelper.narrow(obj);

        Noticia noticia = servicio.obtenerNoticia("1");

        System.out.println("Titulo: " + noticia.titulo);
        System.out.println("Jugador ID: " + noticia.jugadorId);
        System.out.println("Cuerpo: " + noticia.cuerpo);
        System.out.println("Fecha: " + noticia.fechaCreacion);

        orb.destroy();
    }
}