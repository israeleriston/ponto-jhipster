package br.com.webpublico.ponto.domain.enumeration;

/**
 * The TipoHora enumeration.
 */
public enum TipoHora {
    PRIMEIRA_ENTRADA("Primeira Entrada"),
    PRIMEIRA_SAIDA("Primeira Saida"),
    SEGUNDA_ENTRADA("Segunda Entrada"),
    SEGUNDA_SAIDA("Segunda Saida");

    private String descricao;

    TipoHora(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }


    @Override
    public String toString() {
        return descricao;
    }
}
