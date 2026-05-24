package com.proyecto.corba;

import CorbaModulo.ServicioNoticias;
import CorbaModulo.ServicioNoticiasHelper;
import org.omg.CORBA.ORB;
import org.omg.CosNaming.NamingContextExt;
import org.omg.CosNaming.NamingContextExtHelper;
import org.omg.PortableServer.POA;
import org.omg.PortableServer.POAHelper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.Properties;

@Configuration
public class CorbaSetup {

    @Bean
    public ServicioNoticias inicializarCorba(ServicioNoticiasImpl servicioImpl) {
        try {
            Properties props = new Properties();
            props.put("org.omg.CORBA.ORBInitialPort", "1050");
            props.put("org.omg.CORBA.ORBInitialHost", "localhost");
            
            String[] args = {};
            ORB orb = ORB.init(args, props);

            POA rootpoa = POAHelper.narrow(orb.resolve_initial_references("RootPOA"));
            rootpoa.the_POAManager().activate();

            org.omg.CORBA.Object objRef = orb.resolve_initial_references("NameService");
            NamingContextExt ncRef = NamingContextExtHelper.narrow(objRef);

            org.omg.CORBA.Object ref = rootpoa.servant_to_reference(servicioImpl);
            ServicioNoticias href = ServicioNoticiasHelper.narrow(ref);

            ncRef.rebind(ncRef.to_name("ServicioNoticias"), href);
            System.out.println(" [CORBA ORB] Servidor de noticias registrado con éxito en el puerto 1050.");

            new Thread(orb::run).start();

            return href;

        } catch (Exception e) {
            System.err.println("❌ Error al inicializar CORBA: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}