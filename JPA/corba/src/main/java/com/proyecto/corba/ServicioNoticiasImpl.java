package com.proyecto.corba;

import java.util.HashMap;
import java.util.Map;

public class ServicioNoticiasImpl implements ServicioNoticiasOperations {

    private final Map<String, Noticia> almacen = new HashMap<>();

    @Override
    public void publicarNoticia(Noticia noticia) {
        almacen.put(noticia.id, noticia);
        System.out.println("Noticia publicada: " + noticia.titulo);
    }

    @Override
    public Noticia obtenerNoticia(String id) {
        return almacen.getOrDefault(id, new Noticia("", "", "No encontrada", "", ""));
    }
}