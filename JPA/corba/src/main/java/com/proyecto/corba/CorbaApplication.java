package com.proyecto.corba;

import java.util.Properties;

import org.omg.CORBA.ORB;
import org.omg.CosNaming.NameComponent;
import org.omg.CosNaming.NamingContextExt;
import org.omg.CosNaming.NamingContextExtHelper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CorbaApplication {
    public static void main(String[] args) throws Exception {
        System.setProperty("com.sun.corba.ee.ORBNoOptionalFeatures", "true");
        
        SpringApplication.run(CorbaApplication.class, args);

        String[] orbArgs = {
            "-ORBInitialPort", "1060",
            "-ORBInitialHost", "127.0.0.1"
        };

        Properties props = new Properties();
        props.setProperty("com.sun.corba.ee.ORBNoOptionalFeatures", "true");
        props.setProperty("com.sun.corba.ee.ORBUseDynamicStub", "false");
        props.setProperty("com.sun.corba.ee.impl.orb.ORBImpl.managedObjectManagerFactory", "");

        ORB orb = ORB.init(orbArgs, props);

        ServicioNoticiasImpl impl = new ServicioNoticiasImpl();
        ServicioNoticias_Tie servicio = new ServicioNoticias_Tie(impl);
        orb.connect(servicio);

        org.omg.CORBA.Object objRef = orb.resolve_initial_references("NameService");
        NamingContextExt ncRef = NamingContextExtHelper.narrow(objRef);
        NameComponent[] path = ncRef.to_name("ServicioNoticias");
        ncRef.rebind(path, servicio);

        System.out.println(" ¡Servidor CORBA listo y esperando peticiones!");
    

        Thread orbThread = new Thread(() -> orb.run());
        orbThread.setDaemon(true);
        orbThread.start();
    }
}