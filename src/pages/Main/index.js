import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { From, SubmitButton, List } from './styles';

export default class Main extends Component {
  state = {
    newRepository: '',
    repositories: [],
    loading: false,
    error: null,
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) this.setState({ repositories: JSON.parse(repositories) });
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories)
      localStorage.setItem('repositories', JSON.stringify(repositories));
  }

  handleInputChange = (e) => {
    this.setState({ newRepository: e.target.value });
  };

  handleSubmit = async (e) => {
    try {
      e.preventDefault();

      this.setState({ loading: true });

      const { newRepository, repositories } = this.state;

      const repositoryExists = repositories.find(
        (r) => r.name === newRepository
      );

      if (repositoryExists) throw new Error('Repositório duplicado');

      const response = await api.get(`/repos/${newRepository}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepository: '',
        loading: false,
        error: null,
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { newRepository, loading, repositories, error } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <From onSubmit={this.handleSubmit} hasError={error}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepository}
            onChange={this.handleInputChange}
          />

          <SubmitButton isLoading={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </From>

        <List>
          {repositories.map((repository) => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
