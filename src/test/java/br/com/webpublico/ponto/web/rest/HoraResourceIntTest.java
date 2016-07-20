package br.com.webpublico.ponto.web.rest;

import br.com.webpublico.ponto.PontoApp;
import br.com.webpublico.ponto.domain.Hora;
import br.com.webpublico.ponto.domain.enumeration.TipoHora;
import br.com.webpublico.ponto.repository.HoraRepository;
import br.com.webpublico.ponto.repository.search.HoraSearchRepository;
import br.com.webpublico.ponto.service.HoraService;
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
 * Test class for the HoraResource REST controller.
 *
 * @see HoraResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = PontoApp.class)
@WebAppConfiguration
@IntegrationTest
public class HoraResourceIntTest {


    private static final LocalDate DEFAULT_DATA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA = LocalDate.now(ZoneId.systemDefault());

    private static final TipoHora DEFAULT_TIPO_HORA = TipoHora.PRIMEIRA_ENTRADA;
    private static final TipoHora UPDATED_TIPO_HORA = TipoHora.PRIMEIRA_SAIDA;

    @Inject
    private HoraRepository horaRepository;

    @Inject
    private HoraService horaService;

    @Inject
    private HoraSearchRepository horaSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restHoraMockMvc;

    private Hora hora;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        HoraResource horaResource = new HoraResource();
        ReflectionTestUtils.setField(horaResource, "horaService", horaService);
        this.restHoraMockMvc = MockMvcBuilders.standaloneSetup(horaResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        horaSearchRepository.deleteAll();
        hora = new Hora();
        hora.setData(DEFAULT_DATA);
        hora.setTipoHora(DEFAULT_TIPO_HORA);
    }

    @Test
    @Transactional
    public void createHora() throws Exception {
        int databaseSizeBeforeCreate = horaRepository.findAll().size();

        // Create the Hora

        restHoraMockMvc.perform(post("/api/horas")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(hora)))
                .andExpect(status().isCreated());

        // Validate the Hora in the database
        List<Hora> horas = horaRepository.findAll();
        assertThat(horas).hasSize(databaseSizeBeforeCreate + 1);
        Hora testHora = horas.get(horas.size() - 1);
        assertThat(testHora.getData()).isEqualTo(DEFAULT_DATA);
        assertThat(testHora.getTipoHora()).isEqualTo(DEFAULT_TIPO_HORA);

        // Validate the Hora in ElasticSearch
        Hora horaEs = horaSearchRepository.findOne(testHora.getId());
        assertThat(horaEs).isEqualToComparingFieldByField(testHora);
    }

    @Test
    @Transactional
    public void getAllHoras() throws Exception {
        // Initialize the database
        horaRepository.saveAndFlush(hora);

        // Get all the horas
        restHoraMockMvc.perform(get("/api/horas?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(hora.getId().intValue())))
                .andExpect(jsonPath("$.[*].data").value(hasItem(DEFAULT_DATA.toString())))
                .andExpect(jsonPath("$.[*].tipoHora").value(hasItem(DEFAULT_TIPO_HORA.toString())));
    }

    @Test
    @Transactional
    public void getHora() throws Exception {
        // Initialize the database
        horaRepository.saveAndFlush(hora);

        // Get the hora
        restHoraMockMvc.perform(get("/api/horas/{id}", hora.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(hora.getId().intValue()))
            .andExpect(jsonPath("$.data").value(DEFAULT_DATA.toString()))
            .andExpect(jsonPath("$.tipoHora").value(DEFAULT_TIPO_HORA.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingHora() throws Exception {
        // Get the hora
        restHoraMockMvc.perform(get("/api/horas/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateHora() throws Exception {
        // Initialize the database
        horaService.save(hora);

        int databaseSizeBeforeUpdate = horaRepository.findAll().size();

        // Update the hora
        Hora updatedHora = new Hora();
        updatedHora.setId(hora.getId());
        updatedHora.setData(UPDATED_DATA);
        updatedHora.setTipoHora(UPDATED_TIPO_HORA);

        restHoraMockMvc.perform(put("/api/horas")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedHora)))
                .andExpect(status().isOk());

        // Validate the Hora in the database
        List<Hora> horas = horaRepository.findAll();
        assertThat(horas).hasSize(databaseSizeBeforeUpdate);
        Hora testHora = horas.get(horas.size() - 1);
        assertThat(testHora.getData()).isEqualTo(UPDATED_DATA);
        assertThat(testHora.getTipoHora()).isEqualTo(UPDATED_TIPO_HORA);

        // Validate the Hora in ElasticSearch
        Hora horaEs = horaSearchRepository.findOne(testHora.getId());
        assertThat(horaEs).isEqualToComparingFieldByField(testHora);
    }

    @Test
    @Transactional
    public void deleteHora() throws Exception {
        // Initialize the database
        horaService.save(hora);

        int databaseSizeBeforeDelete = horaRepository.findAll().size();

        // Get the hora
        restHoraMockMvc.perform(delete("/api/horas/{id}", hora.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean horaExistsInEs = horaSearchRepository.exists(hora.getId());
        assertThat(horaExistsInEs).isFalse();

        // Validate the database is empty
        List<Hora> horas = horaRepository.findAll();
        assertThat(horas).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchHora() throws Exception {
        // Initialize the database
        horaService.save(hora);

        // Search the hora
        restHoraMockMvc.perform(get("/api/_search/horas?query=id:" + hora.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(hora.getId().intValue())))
            .andExpect(jsonPath("$.[*].data").value(hasItem(DEFAULT_DATA.toString())))
            .andExpect(jsonPath("$.[*].tipoHora").value(hasItem(DEFAULT_TIPO_HORA.toString())));
    }
}
