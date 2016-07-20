package br.com.webpublico.ponto.web.rest;

import br.com.webpublico.ponto.domain.Feriado;
import br.com.webpublico.ponto.service.FeriadoService;
import br.com.webpublico.ponto.web.rest.util.HeaderUtil;
import br.com.webpublico.ponto.web.rest.util.PaginationUtil;
import com.codahale.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Feriado.
 */
@RestController
@RequestMapping("/api")
public class FeriadoResource {

    private final Logger log = LoggerFactory.getLogger(FeriadoResource.class);
        
    @Inject
    private FeriadoService feriadoService;
    
    /**
     * POST  /feriados : Create a new feriado.
     *
     * @param feriado the feriado to create
     * @return the ResponseEntity with status 201 (Created) and with body the new feriado, or with status 400 (Bad Request) if the feriado has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/feriados",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Feriado> createFeriado(@RequestBody Feriado feriado) throws URISyntaxException {
        log.debug("REST request to save Feriado : {}", feriado);
        if (feriado.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("feriado", "idexists", "A new feriado cannot already have an ID")).body(null);
        }
        Feriado result = feriadoService.save(feriado);
        return ResponseEntity.created(new URI("/api/feriados/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("feriado", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /feriados : Updates an existing feriado.
     *
     * @param feriado the feriado to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated feriado,
     * or with status 400 (Bad Request) if the feriado is not valid,
     * or with status 500 (Internal Server Error) if the feriado couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/feriados",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Feriado> updateFeriado(@RequestBody Feriado feriado) throws URISyntaxException {
        log.debug("REST request to update Feriado : {}", feriado);
        if (feriado.getId() == null) {
            return createFeriado(feriado);
        }
        Feriado result = feriadoService.save(feriado);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("feriado", feriado.getId().toString()))
            .body(result);
    }

    /**
     * GET  /feriados : get all the feriados.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of feriados in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/feriados",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Feriado>> getAllFeriados(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Feriados");
        Page<Feriado> page = feriadoService.findAll(pageable); 
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/feriados");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /feriados/:id : get the "id" feriado.
     *
     * @param id the id of the feriado to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the feriado, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/feriados/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Feriado> getFeriado(@PathVariable Long id) {
        log.debug("REST request to get Feriado : {}", id);
        Feriado feriado = feriadoService.findOne(id);
        return Optional.ofNullable(feriado)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /feriados/:id : delete the "id" feriado.
     *
     * @param id the id of the feriado to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/feriados/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteFeriado(@PathVariable Long id) {
        log.debug("REST request to delete Feriado : {}", id);
        feriadoService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("feriado", id.toString())).build();
    }

    /**
     * SEARCH  /_search/feriados?query=:query : search for the feriado corresponding
     * to the query.
     *
     * @param query the query of the feriado search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/feriados",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Feriado>> searchFeriados(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Feriados for query {}", query);
        Page<Feriado> page = feriadoService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/feriados");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}
