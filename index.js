(() => {
    const numberRegexp = /^\d+$/;

    const bmiCategories = [
        { category: 'underweight', range: [0, 18.5] },
        { category: 'healthy weight', range: [18.5, 24.9] },
        { category: 'overweight', range: [25, 29.9] },
        { category: 'obese', range: [30, 1000] }
    ];

    const clearInputFields = () => {
        const numberInputFields = document.querySelectorAll('input[type="text"]');

        numberInputFields.forEach(input => input.value = '');
    };

    const resetBmiResult = () => {
        const bmiElement = document.querySelector('#bmi');
        const bmiTextElement = document.querySelector('#bmi-text');
        const bmiResultElement = document.querySelector('#bmi-result');
        const bmiWelcomeElement = document.querySelector('#bmi-welcome');
        const cardFooterElement = document.querySelector('.card__footer');

        bmiResultElement.style.gap = '0';
        bmiElement.style.display = 'none';
        cardFooterElement.style.gap = '0.8rem';
        bmiWelcomeElement.textContent = 'Welcome';
        bmiTextElement.textContent = 'Enter your height and weight and you\'ll see your BMI result here';
    };

    const setBmiText = (bmi, height) => {
        const bmiElement = document.querySelector('#bmi');
        const bmiTextElement = document.querySelector('#bmi-text');
        const bmiResultElement = document.querySelector('#bmi-result');
        const bmiWelcomeElement = document.querySelector('#bmi-welcome');
        const cardFooterElement = document.querySelector('.card__footer');

        bmiResultElement.style.gap = '0.8rem';
        cardFooterElement.style.gap = '2.4rem';

        bmiElement.textContent = bmi;
        bmiElement.style.display = 'inline-block';
        bmiWelcomeElement.textContent = 'Your BMI is...';
        bmiTextElement.innerHTML = getBmiTextDescription(Number.parseFloat(bmi), height);
    };

    const handleSwitchLayout = () => {
        const metricContainer = document.querySelector('#metric');
        const imperialContainer = document.querySelector('#imperial');
        const radioButtons = document.querySelectorAll('[name=unit]');

        radioButtons.forEach(radioButton => {
            radioButton.addEventListener('change', () => {
                clearInputFields();
                resetBmiResult();

                if (radioButton.value === 'Imperial') {
                    metricContainer.style.display = 'none';
                    imperialContainer.style.display = 'flex';
                    return;
                }

                metricContainer.style.display = 'flex';
                imperialContainer.style.display = 'none';
            });
        });
    };

    const attachInputListeners = (elements, callback) => {
        elements.forEach(element => element.addEventListener('input', callback));
    };

    const handleMetricBmi = () => {
        const heightElement = document.querySelector('#height');
        const weightElement = document.querySelector('#weight');

        attachInputListeners([heightElement, weightElement], () => calculateMetricBmiValue(heightElement.value, weightElement.value));
    };

    const handleImperialBmi = () => {
        const heightFtElement = document.querySelector('#height-ft');
        const heightInElement = document.querySelector('#height-in');
        const weightStElement = document.querySelector('#weight-st');
        const weightLbsElement = document.querySelector('#weight-lbs');

        const elements = [heightFtElement, heightInElement, weightStElement, weightLbsElement];
        
        attachInputListeners(elements, () => calculateImperialBmiValue(
            heightFtElement.value, heightInElement.value,
            weightStElement.value, weightLbsElement.value
        ));
    };

    const calculateImperialBmiValue = (heightFt, heightIn, weightSt, weightLbs) => {
        const allValuesValid = [heightFt, heightIn, weightSt, weightLbs].every(value => numberRegexp.test(value));

        if (!allValuesValid) return;

        const height = getImperialHeightInMeters(heightFt, heightIn);
        const bmi = getImperialBmi(heightFt, heightIn, weightSt, weightLbs);

        setBmiText(bmi, height * 100);
    };

    const getImperialHeightInMeters = (heightFeet, heightInches) => heightFeet * 0.3048 + heightInches * 0.0254;

    const getImperialBmi = (heightFt, heightIn, weightSt, weightLbs) => {
        const heightMeters = getImperialHeightInMeters(heightFt, heightIn);
        const weightKg = weightSt * 6.35029 + weightLbs * 0.453592;

        return (weightKg / (heightMeters * heightMeters)).toFixed(1);
    };

    const calculateMetricBmiValue = (height, weight) => {
        if (!numberRegexp.test(height) || !numberRegexp.test(weight)) return;

        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

        setBmiText(bmi, height);
    };

    const calculateWeightRange = (height) => {
        const heightInMeters = height / 100;
        const weightLower = 18.5 * heightInMeters * heightInMeters;
        const weightUpper = 24.9 * heightInMeters * heightInMeters;

        return [weightLower.toFixed(1), weightUpper.toFixed(1)];
    };

    const getBmiTextDescription = (bmi, height) => {
        const matchingCategory = bmiCategories.find(item => {
            const [min, max] = item.range;
            return bmi >= min && bmi <= max;
        });

        if (!matchingCategory) return 'Invalid BMI';

        const { category } = matchingCategory;
        const [lower, upper] = calculateWeightRange(height);

        return `Your BMI suggests you're a ${category}. Your ideal weight is between <b>${lower}kgs - ${upper}kgs.</b>`;
    };

    document.addEventListener('DOMContentLoaded', () => {
        handleSwitchLayout();
        handleMetricBmi();
        handleImperialBmi();
    });
})();
