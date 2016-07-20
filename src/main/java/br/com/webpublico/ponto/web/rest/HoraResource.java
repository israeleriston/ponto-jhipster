package br.com.webpublico.ponto.web.rest;

import br.com.webpublico.ponto.domain.Hora;
import br.com.webpublico.ponto.service.HoraService;
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
 * REST controller for managing Hora.
 */
@RestController
@RequestMapping("/api")
public class HoraResource {

    private final Logger log = LoggerFactory.getLogger(HoraResource.class);
        
    @Inject
    private HoraService horaService;
    
    /**
     * POST  /horas : Create a new hora.
     *
     * @param hora the hora to create
     * @return the ResponseEntity with status 201 (Created) and with body the new hora, or with status 400 (Bad Request) if the hora has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/horas",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Hora> createHora(@RequestBody Hora hora) throws URISyntaxException {
        log.debug("REST request to save Hora : {}", hora);
        if (hora.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("hora", "idexists", "A new hora cannot already have an ID")).body(null);
        }
        Hora result = horaService.save(hora);
        return ResponseEntity.created(new URI("/api/horas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("hora", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /horas : Updates an existing hora.
     *
     * @param hora the hora to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated hora,
     * or with status 400 (Bad Request) if the hora is not valid,
     * or with status 500 (Internal Server Error) if the hora couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/horas",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Hora> updateHora(@RequestBody Hora hora) throws URISyntaxException {
        log.debug("REST request to update Hora : {}", hora);
        if (hora.getId() == null) {
            return createHora(hora);
        }
        Hora result = horaService.save(hora);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("hora", hora.getId().toString()))
            .body(result);
    }

    /**
     * GET  /horas : get all the horas.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of horas in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/horas",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Hora>> getAllHoras(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Horas");
        Page<Hora> page = horaService.findAll(pageable); 
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/horas");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /horas/:id : get the "id" hora.
     *
     * @param id the id of the hora to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the hora, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/horas/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Hora> getHora(@PathVariable Long id) {
        log.debug("REST request to get Hora : {}", id);
        Hora hora = horaService.findOne(id);
        return Optional.ofNullable(hora)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /horas/:id : delete the "id" hora.
     *
     * @param id the id of the hora to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/horas/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteHora(@PathVariable Long id) {
        log.debug("REST request to delete Hora : {}", id);
        horaService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("hora", id.toString())).build();
    }

    /**
     * SEARCH  /_search/horas?query=:query : search for the hora corresponding
     * to the query.
     *
     * @param query the query of the hora search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/horas",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Hora>> searchHoras(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Horas for query {}", query);
        Page<Hora> page = horaService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/horas");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}
