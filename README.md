# Campus Party Brasil: Uma análise da programação das 10 edições realizadas entre 2022 e 2024

- A [versão 1](https://github.com/gusalbukrk/cpbr-programacao-analise/commit/64790beaa47dd29a6e3ba9b89259cc7c15550133) deste projeto foi apresentada em um artigo científico, na 10ª edição da revista da Campus Party Brasil, disponível [aqui](https://brasil.campus-party.org/revista-cientifica/).
- A [versão 2](https://github.com/gusalbukrk/cpbr-programacao-analise/commit/a6605d0b3b52481511e8322610b87feb5e3d33fc) deste projeto foi apresentada em uma palestra na CPBR17, conforme divulgado [aqui](https://app.4.events/palestrante-Luiz-Gustavo-Albuquerque-6117-c18443).

## Modelos do Gemini utilizados

- [v1](https://github.com/gusalbukrk/cpbr-programacao-analise/commit/64790beaa47dd29a6e3ba9b89259cc7c15550133): `gemini-2.0-flash-lite`
- [v2](https://github.com/gusalbukrk/cpbr-programacao-analise/commit/a6605d0b3b52481511e8322610b87feb5e3d33fc): `gemini-2.5-flash-preview-04-17`

## Como rodar

- `python -m venv .venv`
- `source .venv/bin/activate`
- `pip install -r requirements.txt`
- para executar o script `categorizar.py`, crie o arquivo `.env` na raiz do projeto contendo a variável `API_KEY` com a sua chave da API do Gemini
- para visualizar o dashboard, execute `streamlit run src/visualizar.py`

## Como citar

Se você utilizar o código ou o dataset deste repositório em seu trabalho, por favor, cite-o da seguinte forma:

```bibtex
@misc{albuquerque2025,
  title={{Campus Party Brasil: Uma análise da programação das 10 edições realizadas entre 2022 e 2024}},
  author={{Luiz Gustavo Albuquerque}},
  year={2025},
  url={https://github.com/gusalbukrk/cpbr-programacao-analise},
  notes={Código e dataset}
}
```
