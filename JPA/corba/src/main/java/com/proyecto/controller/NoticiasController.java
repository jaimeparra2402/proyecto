package com.proyecto.controller;

import CorbaModulo.Noticia;
import CorbaModulo.ServicioNoticias;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/noticias")
@CrossOrigin(origins = "*") 
public class NoticiasController {

    @Autowired
    private ServicioNoticias servicioNoticiasCliente;

    @GetMapping
    public Noticia[] listarNoticias() {
        if (servicioNoticiasCliente == null) {
            return new Noticia[0];
        }
        return servicioNoticiasCliente.obtenerNoticias();
    }

    @PostMapping
    public String crearNoticia(@RequestBody NoticiaWrapper nuevaNoticia) {
        if (servicioNoticiasCliente == null) {
            return "El servicio CORBA no está disponible.";
        }
        
        Noticia noticiaCorba = new Noticia(
            nuevaNoticia.getTitular(),
            nuevaNoticia.getContenido(),
            nuevaNoticia.getJugadorAsociado(),
            nuevaNoticia.getFecha()
        );

        servicioNoticiasCliente.enviarNoticia(noticiaCorba);
        return "Noticia publicada y distribuida a través del ORB de CORBA.";
    }
}

class NoticiaWrapper {
    private String titular;
    private String contenido;
    private String jugadorAsociado;
    private String fecha;

    public String getTitular() { return titular; }
    public void setTitular(String t) { this.titular = t; }
    public String getContenido() { return contenido; }
    public void setContenido(String c) { this.contenido = c; }
    public String getJugadorAsociado() { return jugadorAsociado; }
    public void setJugadorAsociado(String j) { this.jugadorAsociado = j; }
    public String getFecha() { return fecha; }
    public void setFecha(String f) { this.fecha = f; }
}