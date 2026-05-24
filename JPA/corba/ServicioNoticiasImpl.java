package com.proyecto.corba;

import CorbaModulo.Noticia;
import CorbaModulo.ServicioNoticiasPOA;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class ServicioNoticiasImpl extends ServicioNoticiasPOA {
    
    private final List<Noticia> listaDeNoticias = new ArrayList<>();

    @Override
    public void enviarNoticia(Noticia nuevaNoticia) {
        listaDeNoticias.add(nuevaNoticia);
        System.out.println(" [CORBA ORB] Nueva noticia recibida: " + nuevaNoticia.titular);
    }

    @Override
    public Noticia[] obtenerNoticias() {
        System.out.println(" [CORBA ORB] Enviando lista de noticias...");
        return listaDeNoticias.toArray(new Noticia[0]);
    }
}