package br.com.webpublico.ponto.web.rest;

import br.com.webpublico.ponto.domain.Dia;
import br.com.webpublico.ponto.service.DiaService;
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
 * REST controller for managing Dia.
 */
@RestController
@RequestMapping("/api")
public class DiaResource {

    private final Logger log = LoggerFactory.getLogger(DiaResource.class);
        
    @Inject
    private DiaService diaService;
    
    /**
     * POST  /dias : Create a new dia.
     *
     * @param dia the dia to create
     * @return the ResponseEntity with status 201 (Created) and with body the new dia, or with status 400 (Bad Request) if the dia has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/dias",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Dia> createDia(@RequestBody Dia dia) throws URISyntaxException {
        log.debug("REST request to save Dia : {}", dia);
        if (dia.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("dia", "idexists", "A new dia cannot already have an ID")).body(null);
        }
        Dia result = diaService.save(dia);
        return ResponseEntity.created(new URI("/api/dias/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("dia", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /dias : Updates an existing dia.
     *
     * @param dia the dia to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated dia,
     * or with status 400 (Bad Request) if the dia is not valid,
     * or with status 500 (Internal Server Error) if the dia couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/dias",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Dia> updateDia(@RequestBody Dia dia) throws URISyntaxException {
        log.debug("REST request to update Dia : {}", dia);
        if (dia.getId() == null) {
            return createDia(dia);
        }
        Dia result = diaService.save(dia);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("dia", dia.getId().toString()))
            .body(result);
    }

    /**
     * GET  /dias : get all the dias.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of dias in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/dias",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Dia>> getAllDias(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Dias");
        Page<Dia> page = diaService.findAll(pageable); 
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/dias");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /dias/:id : get the "id" dia.
     *
     * @param id the id of the dia to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the dia, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/dias/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Dia> getDia(@PathVariable Long id) {
        log.debug("REST request to get Dia : {}", id);
        Dia dia = diaService.findOne(id);
        return Optional.ofNullable(dia)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /dias/:id : delete the "id" dia.
     *
     * @param id the id of the dia to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/dias/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteDia(@PathVariable Long id) {
        log.debug("REST request to delete Dia : {}", id);
        diaService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("dia", id.toString())).build();
    }

    /**
     * SEARCH  /_search/dias?query=:query : search for the dia corresponding
     * to the query.
     *
     * @param query the query of the dia search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/dias",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Dia>> searchDias(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Dias for query {}", query);
        Page<Dia> page = diaService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/dias");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}
