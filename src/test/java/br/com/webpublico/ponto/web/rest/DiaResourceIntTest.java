package br.com.webpublico.ponto.web.rest;

import br.com.webpublico.ponto.PontoApp;
import br.com.webpublico.ponto.domain.Dia;
import br.com.webpublico.ponto.repository.DiaRepository;
import br.com.webpublico.ponto.repository.search.DiaSearchRepository;
import br.com.webpublico.ponto.service.DiaService;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the DiaResource REST controller.
 *
 * @see DiaResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = PontoApp.class)
@WebAppConfiguration
@IntegrationTest
public class DiaResourceIntTest {


    private static final LocalDate DEFAULT_DATA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA = LocalDate.now(ZoneId.systemDefault());

    private static final Boolean DEFAULT_FERIADO = false;
    private static final Boolean UPDATED_FERIADO = true;

    @Inject
    private DiaRepository diaRepository;

    @Inject
    private DiaService diaService;

    @Inject
    private DiaSearchRepository diaSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restDiaMockMvc;

    private Dia dia;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        DiaResource diaResource = new DiaResource();
        ReflectionTestUtils.setField(diaResource, "diaService", diaService);
        this.restDiaMockMvc = MockMvcBuilders.standaloneSetup(diaResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        diaSearchRepository.deleteAll();
        dia = new Dia();
        dia.setData(DEFAULT_DATA);
        dia.setFeriado(DEFAULT_FERIADO);
    }

    @Test
    @Transactional
    public void createDia() throws Exception {
        int databaseSizeBeforeCreate = diaRepository.findAll().size();

        // Create the Dia

        restDiaMockMvc.perform(post("/api/dias")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(dia)))
                .andExpect(status().isCreated());

        // Validate the Dia in the database
        List<Dia> dias = diaRepository.findAll();
        assertThat(dias).hasSize(databaseSizeBeforeCreate + 1);
        Dia testDia = dias.get(dias.size() - 1);
        assertThat(testDia.getData()).isEqualTo(DEFAULT_DATA);
        assertThat(testDia.isFeriado()).isEqualTo(DEFAULT_FERIADO);

        // Validate the Dia in ElasticSearch
        Dia diaEs = diaSearchRepository.findOne(testDia.getId());
        assertThat(diaEs).isEqualToComparingFieldByField(testDia);
    }

    @Test
    @Transactional
    public void getAllDias() throws Exception {
        // Initialize the database
        diaRepository.saveAndFlush(dia);

        // Get all the dias
        restDiaMockMvc.perform(get("/api/dias?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(dia.getId().intValue())))
                .andExpect(jsonPath("$.[*].data").value(hasItem(DEFAULT_DATA.toString())))
                .andExpect(jsonPath("$.[*].feriado").value(hasItem(DEFAULT_FERIADO.booleanValue())));
    }

    @Test
    @Transactional
    public void getDia() throws Exception {
        // Initialize the database
        diaRepository.saveAndFlush(dia);

        // Get the dia
        restDiaMockMvc.perform(get("/api/dias/{id}", dia.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(dia.getId().intValue()))
            .andExpect(jsonPath("$.data").value(DEFAULT_DATA.toString()))
            .andExpect(jsonPath("$.feriado").value(DEFAULT_FERIADO.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingDia() throws Exception {
        // Get the dia
        restDiaMockMvc.perform(get("/api/dias/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDia() throws Exception {
        // Initialize the database
        diaService.save(dia);

        int databaseSizeBeforeUpdate = diaRepository.findAll().size();

        // Update the dia
        Dia updatedDia = new Dia();
        updatedDia.setId(dia.getId());
        updatedDia.setData(UPDATED_DATA);
        updatedDia.setFeriado(UPDATED_FERIADO);

        restDiaMockMvc.perform(put("/api/dias")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedDia)))
                .andExpect(status().isOk());

        // Validate the Dia in the database
        List<Dia> dias = diaRepository.findAll();
        assertThat(dias).hasSize(databaseSizeBeforeUpdate);
        Dia testDia = dias.get(dias.size() - 1);
        assertThat(testDia.getData()).isEqualTo(UPDATED_DATA);
        assertThat(testDia.isFeriado()).isEqualTo(UPDATED_FERIADO);

        // Validate the Dia in ElasticSearch
        Dia diaEs = diaSearchRepository.findOne(testDia.getId());
        assertThat(diaEs).isEqualToComparingFieldByField(testDia);
    }

    @Test
    @Transactional
    public void deleteDia() throws Exception {
        // Initialize the database
        diaService.save(dia);

        int databaseSizeBeforeDelete = diaRepository.findAll().size();

        // Get the dia
        restDiaMockMvc.perform(delete("/api/dias/{id}", dia.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean diaExistsInEs = diaSearchRepository.exists(dia.getId());
        assertThat(diaExistsInEs).isFalse();

        // Validate the database is empty
        List<Dia> dias = diaRepository.findAll();
        assertThat(dias).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchDia() throws Exception {
        // Initialize the database
        diaService.save(dia);

        // Search the dia
        restDiaMockMvc.perform(get("/api/_search/dias?query=id:" + dia.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dia.getId().intValue())))
            .andExpect(jsonPath("$.[*].data").value(hasItem(DEFAULT_DATA.toString())))
            .andExpect(jsonPath("$.[*].feriado").value(hasItem(DEFAULT_FERIADO.booleanValue())));
    }
}
