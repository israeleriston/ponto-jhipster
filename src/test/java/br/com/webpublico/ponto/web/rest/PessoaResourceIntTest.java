package br.com.webpublico.ponto.web.rest;

import br.com.webpublico.ponto.PontoApp;
import br.com.webpublico.ponto.domain.Pessoa;
import br.com.webpublico.ponto.repository.PessoaRepository;
import br.com.webpublico.ponto.repository.search.PessoaSearchRepository;
import br.com.webpublico.ponto.service.PessoaService;
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
 * Test class for the PessoaResource REST controller.
 *
 * @see PessoaResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = PontoApp.class)
@WebAppConfiguration
@IntegrationTest
public class PessoaResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAA";
    private static final String UPDATED_NOME = "BBBBB";
    private static final String DEFAULT_EMAIL = "AAAAA";
    private static final String UPDATED_EMAIL = "BBBBB";
    private static final String DEFAULT_CPF = "AAAAA";
    private static final String UPDATED_CPF = "BBBBB";
    private static final String DEFAULT_INSCRICAO = "AAAAA";
    private static final String UPDATED_INSCRICAO = "BBBBB";

    @Inject
    private PessoaRepository pessoaRepository;

    @Inject
    private PessoaService pessoaService;

    @Inject
    private PessoaSearchRepository pessoaSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restPessoaMockMvc;

    private Pessoa pessoa;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        PessoaResource pessoaResource = new PessoaResource();
        ReflectionTestUtils.setField(pessoaResource, "pessoaService", pessoaService);
        this.restPessoaMockMvc = MockMvcBuilders.standaloneSetup(pessoaResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        pessoaSearchRepository.deleteAll();
        pessoa = new Pessoa();
        pessoa.setNome(DEFAULT_NOME);
        pessoa.setEmail(DEFAULT_EMAIL);
        pessoa.setCpf(DEFAULT_CPF);
        pessoa.setInscricao(DEFAULT_INSCRICAO);
    }

    @Test
    @Transactional
    public void createPessoa() throws Exception {
        int databaseSizeBeforeCreate = pessoaRepository.findAll().size();

        // Create the Pessoa

        restPessoaMockMvc.perform(post("/api/pessoas")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(pessoa)))
                .andExpect(status().isCreated());

        // Validate the Pessoa in the database
        List<Pessoa> pessoas = pessoaRepository.findAll();
        assertThat(pessoas).hasSize(databaseSizeBeforeCreate + 1);
        Pessoa testPessoa = pessoas.get(pessoas.size() - 1);
        assertThat(testPessoa.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testPessoa.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testPessoa.getCpf()).isEqualTo(DEFAULT_CPF);
        assertThat(testPessoa.getInscricao()).isEqualTo(DEFAULT_INSCRICAO);

        // Validate the Pessoa in ElasticSearch
        Pessoa pessoaEs = pessoaSearchRepository.findOne(testPessoa.getId());
        assertThat(pessoaEs).isEqualToComparingFieldByField(testPessoa);
    }

    @Test
    @Transactional
    public void getAllPessoas() throws Exception {
        // Initialize the database
        pessoaRepository.saveAndFlush(pessoa);

        // Get all the pessoas
        restPessoaMockMvc.perform(get("/api/pessoas?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(pessoa.getId().intValue())))
                .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())))
                .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL.toString())))
                .andExpect(jsonPath("$.[*].cpf").value(hasItem(DEFAULT_CPF.toString())))
                .andExpect(jsonPath("$.[*].inscricao").value(hasItem(DEFAULT_INSCRICAO.toString())));
    }

    @Test
    @Transactional
    public void getPessoa() throws Exception {
        // Initialize the database
        pessoaRepository.saveAndFlush(pessoa);

        // Get the pessoa
        restPessoaMockMvc.perform(get("/api/pessoas/{id}", pessoa.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(pessoa.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL.toString()))
            .andExpect(jsonPath("$.cpf").value(DEFAULT_CPF.toString()))
            .andExpect(jsonPath("$.inscricao").value(DEFAULT_INSCRICAO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPessoa() throws Exception {
        // Get the pessoa
        restPessoaMockMvc.perform(get("/api/pessoas/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePessoa() throws Exception {
        // Initialize the database
        pessoaService.save(pessoa);

        int databaseSizeBeforeUpdate = pessoaRepository.findAll().size();

        // Update the pessoa
        Pessoa updatedPessoa = new Pessoa();
        updatedPessoa.setId(pessoa.getId());
        updatedPessoa.setNome(UPDATED_NOME);
        updatedPessoa.setEmail(UPDATED_EMAIL);
        updatedPessoa.setCpf(UPDATED_CPF);
        updatedPessoa.setInscricao(UPDATED_INSCRICAO);

        restPessoaMockMvc.perform(put("/api/pessoas")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedPessoa)))
                .andExpect(status().isOk());

        // Validate the Pessoa in the database
        List<Pessoa> pessoas = pessoaRepository.findAll();
        assertThat(pessoas).hasSize(databaseSizeBeforeUpdate);
        Pessoa testPessoa = pessoas.get(pessoas.size() - 1);
        assertThat(testPessoa.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testPessoa.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testPessoa.getCpf()).isEqualTo(UPDATED_CPF);
        assertThat(testPessoa.getInscricao()).isEqualTo(UPDATED_INSCRICAO);

        // Validate the Pessoa in ElasticSearch
        Pessoa pessoaEs = pessoaSearchRepository.findOne(testPessoa.getId());
        assertThat(pessoaEs).isEqualToComparingFieldByField(testPessoa);
    }

    @Test
    @Transactional
    public void deletePessoa() throws Exception {
        // Initialize the database
        pessoaService.save(pessoa);

        int databaseSizeBeforeDelete = pessoaRepository.findAll().size();

        // Get the pessoa
        restPessoaMockMvc.perform(delete("/api/pessoas/{id}", pessoa.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean pessoaExistsInEs = pessoaSearchRepository.exists(pessoa.getId());
        assertThat(pessoaExistsInEs).isFalse();

        // Validate the database is empty
        List<Pessoa> pessoas = pessoaRepository.findAll();
        assertThat(pessoas).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchPessoa() throws Exception {
        // Initialize the database
        pessoaService.save(pessoa);

        // Search the pessoa
        restPessoaMockMvc.perform(get("/api/_search/pessoas?query=id:" + pessoa.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pessoa.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL.toString())))
            .andExpect(jsonPath("$.[*].cpf").value(hasItem(DEFAULT_CPF.toString())))
            .andExpect(jsonPath("$.[*].inscricao").value(hasItem(DEFAULT_INSCRICAO.toString())));
    }
}
