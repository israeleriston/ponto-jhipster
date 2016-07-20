package br.com.webpublico.ponto.web.rest;

import br.com.webpublico.ponto.PontoApp;
import br.com.webpublico.ponto.domain.Feriado;
import br.com.webpublico.ponto.repository.FeriadoRepository;
import br.com.webpublico.ponto.repository.search.FeriadoSearchRepository;
import br.com.webpublico.ponto.service.FeriadoService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the FeriadoResource REST controller.
 *
 * @see FeriadoResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = PontoApp.class)
@WebAppConfiguration
@IntegrationTest
public class FeriadoResourceIntTest {


    @Inject
    private FeriadoRepository feriadoRepository;

    @Inject
    private FeriadoService feriadoService;

    @Inject
    private FeriadoSearchRepository feriadoSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restFeriadoMockMvc;

    private Feriado feriado;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        FeriadoResource feriadoResource = new FeriadoResource();
        ReflectionTestUtils.setField(feriadoResource, "feriadoService", feriadoService);
        this.restFeriadoMockMvc = MockMvcBuilders.standaloneSetup(feriadoResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        feriadoSearchRepository.deleteAll();
        feriado = new Feriado();
    }

    @Test
    @Transactional
    public void createFeriado() throws Exception {
        int databaseSizeBeforeCreate = feriadoRepository.findAll().size();

        // Create the Feriado

        restFeriadoMockMvc.perform(post("/api/feriados")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(feriado)))
                .andExpect(status().isCreated());

        // Validate the Feriado in the database
        List<Feriado> feriados = feriadoRepository.findAll();
        assertThat(feriados).hasSize(databaseSizeBeforeCreate + 1);
        Feriado testFeriado = feriados.get(feriados.size() - 1);

        // Validate the Feriado in ElasticSearch
        Feriado feriadoEs = feriadoSearchRepository.findOne(testFeriado.getId());
        assertThat(feriadoEs).isEqualToComparingFieldByField(testFeriado);
    }

    @Test
    @Transactional
    public void getAllFeriados() throws Exception {
        // Initialize the database
        feriadoRepository.saveAndFlush(feriado);

        // Get all the feriados
        restFeriadoMockMvc.perform(get("/api/feriados?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(feriado.getId().intValue())));
    }

    @Test
    @Transactional
    public void getFeriado() throws Exception {
        // Initialize the database
        feriadoRepository.saveAndFlush(feriado);

        // Get the feriado
        restFeriadoMockMvc.perform(get("/api/feriados/{id}", feriado.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(feriado.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingFeriado() throws Exception {
        // Get the feriado
        restFeriadoMockMvc.perform(get("/api/feriados/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFeriado() throws Exception {
        // Initialize the database
        feriadoService.save(feriado);

        int databaseSizeBeforeUpdate = feriadoRepository.findAll().size();

        // Update the feriado
        Feriado updatedFeriado = new Feriado();
        updatedFeriado.setId(feriado.getId());

        restFeriadoMockMvc.perform(put("/api/feriados")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedFeriado)))
                .andExpect(status().isOk());

        // Validate the Feriado in the database
        List<Feriado> feriados = feriadoRepository.findAll();
        assertThat(feriados).hasSize(databaseSizeBeforeUpdate);
        Feriado testFeriado = feriados.get(feriados.size() - 1);

        // Validate the Feriado in ElasticSearch
        Feriado feriadoEs = feriadoSearchRepository.findOne(testFeriado.getId());
        assertThat(feriadoEs).isEqualToComparingFieldByField(testFeriado);
    }

    @Test
    @Transactional
    public void deleteFeriado() throws Exception {
        // Initialize the database
        feriadoService.save(feriado);

        int databaseSizeBeforeDelete = feriadoRepository.findAll().size();

        // Get the feriado
        restFeriadoMockMvc.perform(delete("/api/feriados/{id}", feriado.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean feriadoExistsInEs = feriadoSearchRepository.exists(feriado.getId());
        assertThat(feriadoExistsInEs).isFalse();

        // Validate the database is empty
        List<Feriado> feriados = feriadoRepository.findAll();
        assertThat(feriados).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchFeriado() throws Exception {
        // Initialize the database
        feriadoService.save(feriado);

        // Search the feriado
        restFeriadoMockMvc.perform(get("/api/_search/feriados?query=id:" + feriado.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(feriado.getId().intValue())));
    }
}
