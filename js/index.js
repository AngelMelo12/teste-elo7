async function getVacancies () {
    const vacancies = await fetch('http://www.mocky.io/v2/5d6fb6b1310000f89166087b')
        .then((response) => response.json())
        .catch((err) => {return null;});

    return vacancies;
}

function generateVacanciesTemplate(vacancies) {
    let ul = document.createElement('ul');
    ul.classList.add('dev-vacancy');

    vacancies.map(vacancy => {
        if (vacancy.ativa == true) {
            let li = document.createElement('li');
            li.id = 'vacancy';

            let vacancyPosition = document.createElement('h3');
            vacancyPosition.innerText = `${vacancy.cargo}`;

            li.appendChild(vacancyPosition);
            ul.appendChild(li);
        }
    });

    return ul;
};

async function generateVacancyDetailsTemplate(vacancies, vacancyName) {

    let vacancySection = document.createElement('section');
    vacancySection.id = 'vacancy-detail';

    vacancyName = vacancyName.trim().toLowerCase();
    const vacancyDetail = vacancies.filter(vacancy => vacancy.ativa == true)
        .find(vacancy => vacancy.cargo.trim().toLowerCase().includes(vacancyName));

    if (vacancyDetail == null || vacancyDetail == undefined) {
        vacancySection.insertAdjacentText("Não há detalhes para a vaga");
        return vacancySection;
    }

    let link = document.createElement('p');
    link.innerText = `${vacancyDetail.link}`;

    let location = generateVacancyLocationTemplate(vacancyDetail.localizacao);

    vacancySection.appendChild(link);
    vacancySection.appendChild(location);

    return vacancySection;
}

function generateVacancyLocationTemplate(vacancyLocation) {

    let locationSection = document.createElement('section');

    if (vacancyLocation == null || vacancyLocation == undefined) {
        let remote = document.createElement('p');
        remote.innerText = 'Remoto';
        return remote;
    }

    let district = document.createElement('p');
    district.innerText = `Bairro: ${vacancyLocation.bairro}`;

    let city = document.createElement('p');
    city.innerText = `Cidade: ${vacancyLocation.cidade}`;

    let country = document.createElement('p');
    country.innerText = `País: ${vacancyLocation.pais}`;

    locationSection.appendChild(district);
    locationSection.appendChild(city);
    locationSection.appendChild(country);

    return locationSection;
}

async function loadVacancies() {

    const vacancies = await getVacancies();

    if(vacancies == null || vacancies == undefined) {
        document.querySelector(".development").innerHTML = "<h2>Não há vagas!</h2>";
        return;
    }
    
    document.querySelector(".development").appendChild(generateVacanciesTemplate(vacancies.vagas));

    const vacancyContainer = document.querySelector("#development");
    const vacanciesList = vacancyContainer.querySelectorAll('#vacancy');
    
    vacanciesList.forEach(item => {
        item.addEventListener('click', async function(event) {
            const selectedVacancy = event.target.parentElement;
            const vacancyDetail = selectedVacancy.querySelector('#vacancy-detail');

            if(vacancyDetail == null || vacancyDetail == undefined) {
                
                const vacancyName = event.target.innerText;
                const template =  await generateVacancyDetailsTemplate(vacancies.vagas, vacancyName)
                selectedVacancy.appendChild(template);

            } else {
                selectedVacancy.removeChild(vacancyDetail);
            }
        });
    });
}

window.addEventListener('load', function() {
    loadVacancies();
});