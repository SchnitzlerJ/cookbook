var g_Recipes = [
	{
		"name": "Hefeteig (süß)",
		"persons": undefined,
		"ingredients": [
			{ "amount": "500 g", "name": "Mehl" },
			{ "amount": "250 ml", "name": "Milch"},
			{ "amount": "20 g", "name": "Hefe" },
			{ "amount": "60-80 g", "name": "Zucker" },
			{ "amount": "80-100 g", "name": "Butter" },
			{ "amount": "1-2", "name": "Eier"}
		],
		"steps": [
			"$1, $3 und $4 mischen und erwärmen.",
			"$0 in Schüssel geben und eine Kuhle formen.",
			"Die Mischung aus $1, $3 und $4 zusammen mit $2 in die Kuhle geben und vermischen.",
			"Gehen lassen bis sich Bläschen bilden.",
			"$5 hinzugeben, gut durchkneten und auf doppelte Höhe gehen lassen.",
		],
		"inspiration": "Kochen und Backen nach Grundrezepten (Luise Haarer)",
	},
	{
		"name": "Kartoffelcremesuppe",
		"persons": undefined,
		"ingredients": [
			{ "amount": "400 g", "name": "Kartoffeln" },
			{ "amount": "2 EL", "name": "Olivenöl" },
			{ "amount": "2 Zehen", "name": "Knoblauch" },
			{ "amount": "800 ml", "name": "Gemüsebrühe" },
			{ "amount": "150 g", "name": "Crème fraîche" },
		],
		"steps": [
			"$0 schälen und würfeln.",
			"$2 fein hacken und zusammen mit $0 in $1 andünsten.",
			"$3 dazugießen und aufkochen. 10 Minuten kochenlassen.",
			"Die gegarte Suppe fein pürieren, $4 unterschlagen.",
		],
		"inspiration": "TODO",
	},
	{
		"name": "Linsen mit Spätzle",
		"persons": 4,
		"ingredients": [
			{ "amount": "620 g", "name": "Mehl" },
			{ "amount": "6", "name": "Eier" },
			{ "amount": "2 kleine Gläser", "name": "Linsen" },
			{ "amount": "5 kleine Gläser", "name": "Wasser" },
			{ "amount": "1", "name": "große Zwiebel" },
			{ "amount": "2", "name": "Karotten" },
			{ "amount": "2.4 TL", "name": "Salz" },
			{ "amount": "3", "name": "Lorbeerblätter"},
		],
		"steps": [
			"$4 und $5 klein würfeln und mit Butter andünsten.",
			"$2, $3 und $7 hinzugeben und Deckel schließen. Kochen.",
			"$0, $6 und $1 zu einem Teig schlagen.",
			"Spätzle machen.",
			"Linsen mit Essig, Salz und Pfeffer abschmecken.",
		],
		"inspiration": null,
	},


];

var g_SimpleStyle = true;
let g_SelectedRecipe = g_Recipes[(new URL(window.location.href)).searchParams.get("recipe")];

document.getElementById("heading").innerHTML = g_SelectedRecipe.name;

function constructRow(amount, ingred, step)
{
	if (amount == "" && ingred == "" && step == "")
		return "";
	return "<tr><td>" + amount + "</td><td>" + ingred + "</td><td>" + step + "</td></tr>";
}

function constructRecipe()
{
	let compSt = "";
	let simpSt = "";
	let includedIngredients = [];
	let s = 0;
	for (let step of g_SelectedRecipe.steps)
	{
		compSt += constructRow("", "", "<b>" + ++s + ". ");
		let arr = step.split(/(\$[0-9]+)/gi);
		let i = 0;

		let amountStr = "";
		let ingredStr = "";
		let stepStr = "";

		for (let part of arr)
		{
			if (part[0] == "$")
			{
				let ing = part.substring(1);
				if (!includedIngredients.some(a => a == ing))
				{
					compSt += constructRow(amountStr, ingredStr, stepStr);
					includedIngredients.push(ing);
					stepStr = "";
					amountStr = g_SelectedRecipe.ingredients[ing].amount;
					ingredStr = g_SelectedRecipe.ingredients[ing].name;
				}
				else
					stepStr += g_SelectedRecipe.ingredients[ing].name;
			}
			else
				stepStr += part;
		}
		compSt += constructRow(amountStr, ingredStr, stepStr);
		simpSt += "<li>" + step.replace(/\$[0-9]+/gi, (m) => g_SelectedRecipe.ingredients[m.substring(1)].name) + "</li>";
	}
	document.getElementById("ingredients").innerHTML = includedIngredients.map(i =>
		"<tr><td>" + g_SelectedRecipe.ingredients[i].amount + "</td><td>" + g_SelectedRecipe.ingredients[i].name + "</td></tr>"
	).join("");
	document.getElementById("steps").innerHTML = simpSt;

	document.getElementById("complexStyle").innerHTML = compSt;

	document.getElementById("complexStyle").style.display = g_SimpleStyle ? "none" : "inline";
	document.getElementById("steps").style.display = g_SimpleStyle ? "inline" : "none";
	document.getElementById("ingredients").style.display = g_SimpleStyle ? "inline" : "none";
	document.getElementById("persons").innerHTML = "Personen: " + g_SelectedRecipe.persons;
}

function toggleFormat()
{
	g_SimpleStyle = !g_SimpleStyle;
	constructRecipe();
}

window.onload = function()
{
	constructRecipe();
	document.getElementById("toggleFormatButton").addEventListener ("click", toggleFormat, false);
}
