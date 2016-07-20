package br.com.webpublico.ponto.service;

import br.com.webpublico.ponto.domain.Feriado;
import br.com.webpublico.ponto.repository.FeriadoRepository;
import br.com.webpublico.ponto.repository.search.FeriadoSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing Feriado.
 */
@Service
@Transactional
public class FeriadoService {

    private final Logger log = LoggerFactory.getLogger(FeriadoService.class);
    
    @Inject
    private FeriadoRepository feriadoRepository;
    
    @Inject
    private FeriadoSearchRepository feriadoSearchRepository;
    
    /**
     * Save a feriado.
     * 
     * @param feriado the entity to save
     * @return the persisted entity
     */
    public Feriado save(Feriado feriado) {
        log.debug("Request to save Feriado : {}", feriado);
        Feriado result = feriadoRepository.save(feriado);
        feriadoSearchRepository.save(result);
        return result;
    }

    /**
     *  Get all the feriados.
     *  
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true) 
    public Page<Feriado> findAll(Pageable pageable) {
        log.debug("Request to get all Feriados");
        Page<Feriado> result = feriadoRepository.findAll(pageable); 
        return result;
    }

    /**
     *  Get one feriado by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true) 
    public Feriado findOne(Long id) {
        log.debug("Request to get Feriado : {}", id);
        Feriado feriado = feriadoRepository.findOne(id);
        return feriado;
    }

    /**
     *  Delete the  feriado by id.
     *  
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Feriado : {}", id);
        feriadoRepository.delete(id);
        feriadoSearchRepository.delete(id);
    }

    /**
     * Search for the feriado corresponding to the query.
     *
     *  @param query the query of the search
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Feriado> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Feriados for query {}", query);
        return feriadoSearchRepository.search(queryStringQuery(query), pageable);
    }
}
