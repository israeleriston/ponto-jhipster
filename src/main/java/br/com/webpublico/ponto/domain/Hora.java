package br.com.webpublico.ponto.domain;

import br.com.webpublico.ponto.domain.enumeration.TipoHora;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Hora.
 */
@Entity
@Table(name = "hora")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "hora")
public class Hora implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "data")
    private LocalDate data;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_hora")
    private TipoHora tipoHora;

    @ManyToOne
    private Dia dia;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public TipoHora getTipoHora() {
        return tipoHora;
    }

    public void setTipoHora(TipoHora tipoHora) {
        this.tipoHora = tipoHora;
    }

    public Dia getDia() {
        return dia;
    }

    public void setDia(Dia dia) {
        this.dia = dia;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Hora hora = (Hora) o;
        if(hora.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, hora.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Hora{" +
            "id=" + id +
            ", data='" + data + "'" +
            ", tipoHora='" + tipoHora + "'" +
            '}';
    }
}
