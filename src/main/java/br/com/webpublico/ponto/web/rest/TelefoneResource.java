package br.com.webpublico.ponto.web.rest;

import br.com.webpublico.ponto.domain.Telefone;
import br.com.webpublico.ponto.service.TelefoneService;
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
 * REST controller for managing Telefone.
 */
@RestController
@RequestMapping("/api")
public class TelefoneResource {

    private final Logger log = LoggerFactory.getLogger(TelefoneResource.class);
        
    @Inject
    private TelefoneService telefoneService;
    
    /**
     * POST  /telefones : Create a new telefone.
     *
     * @param telefone the telefone to create
     * @return the ResponseEntity with status 201 (Created) and with body the new telefone, or with status 400 (Bad Request) if the telefone has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/telefones",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Telefone> createTelefone(@RequestBody Telefone telefone) throws URISyntaxException {
        log.debug("REST request to save Telefone : {}", telefone);
        if (telefone.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("telefone", "idexists", "A new telefone cannot already have an ID")).body(null);
        }
        Telefone result = telefoneService.save(telefone);
        return ResponseEntity.created(new URI("/api/telefones/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("telefone", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /telefones : Updates an existing telefone.
     *
     * @param telefone the telefone to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated telefone,
     * or with status 400 (Bad Request) if the telefone is not valid,
     * or with status 500 (Internal Server Error) if the telefone couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/telefones",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Telefone> updateTelefone(@RequestBody Telefone telefone) throws URISyntaxException {
        log.debug("REST request to update Telefone : {}", telefone);
        if (telefone.getId() == null) {
            return createTelefone(telefone);
        }
        Telefone result = telefoneService.save(telefone);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("telefone", telefone.getId().toString()))
            .body(result);
    }

    /**
     * GET  /telefones : get all the telefones.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of telefones in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/telefones",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Telefone>> getAllTelefones(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Telefones");
        Page<Telefone> page = telefoneService.findAll(pageable); 
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/telefones");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /telefones/:id : get the "id" telefone.
     *
     * @param id the id of the telefone to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the telefone, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/telefones/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Telefone> getTelefone(@PathVariable Long id) {
        log.debug("REST request to get Telefone : {}", id);
        Telefone telefone = telefoneService.findOne(id);
        return Optional.ofNullable(telefone)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /telefones/:id : delete the "id" telefone.
     *
     * @param id the id of the telefone to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/telefones/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteTelefone(@PathVariable Long id) {
        log.debug("REST request to delete Telefone : {}", id);
        telefoneService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("telefone", id.toString())).build();
    }

    /**
     * SEARCH  /_search/telefones?query=:query : search for the telefone corresponding
     * to the query.
     *
     * @param query the query of the telefone search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/telefones",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Telefone>> searchTelefones(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Telefones for query {}", query);
        Page<Telefone> page = telefoneService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/telefones");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}
