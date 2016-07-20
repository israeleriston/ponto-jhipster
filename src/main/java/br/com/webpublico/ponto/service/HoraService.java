package br.com.webpublico.ponto.service;

import br.com.webpublico.ponto.domain.Hora;
import br.com.webpublico.ponto.repository.HoraRepository;
import br.com.webpublico.ponto.repository.search.HoraSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing Hora.
 */
@Service
@Transactional
public class HoraService {

    private final Logger log = LoggerFactory.getLogger(HoraService.class);
    
    @Inject
    private HoraRepository horaRepository;
    
    @Inject
    private HoraSearchRepository horaSearchRepository;
    
    /**
     * Save a hora.
     * 
     * @param hora the entity to save
     * @return the persisted entity
     */
    public Hora save(Hora hora) {
        log.debug("Request to save Hora : {}", hora);
        Hora result = horaRepository.save(hora);
        horaSearchRepository.save(result);
        return result;
    }

    /**
     *  Get all the horas.
     *  
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true) 
    public Page<Hora> findAll(Pageable pageable) {
        log.debug("Request to get all Horas");
        Page<Hora> result = horaRepository.findAll(pageable); 
        return result;
    }

    /**
     *  Get one hora by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true) 
    public Hora findOne(Long id) {
        log.debug("Request to get Hora : {}", id);
        Hora hora = horaRepository.findOne(id);
        return hora;
    }

    /**
     *  Delete the  hora by id.
     *  
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Hora : {}", id);
        horaRepository.delete(id);
        horaSearchRepository.delete(id);
    }

    /**
     * Search for the hora corresponding to the query.
     *
     *  @param query the query of the search
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Hora> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Horas for query {}", query);
        return horaSearchRepository.search(queryStringQuery(query), pageable);
    }
}
