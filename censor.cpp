#include <iostream>
#include <fstream>
#include <string>

using namespace std;

int main() {
	system("chcp 65001");
	ifstream fileRead;
	ofstream fileWrite;
	fileRead.open("input.html");

	if (!fileRead.good()) {
		cout << endl << "index.html doesn't exist in current directory" << endl;
		return 1;
	}

	fileWrite.open("output.html", ios::trunc);
	string temp;
	int changed=0;
	line:
	while(getline(fileRead, temp)) {
		for (int i=0; i<temp.length(); i++) {

			if (temp[i]=='<') {

				fileWrite << temp[i];
				i++;
				if (temp[i]!='/' && temp[i-1]!='"') {
					cout << endl;
				}
					while (temp[i]!='>' && temp[i]!='!') {

						if (temp[i]=='{' || temp[i]=='}') {
							goto line;
						}
							if (temp[i]=='"') {
								fileWrite << temp[i];
								i++;
								while (temp[i]!='"') {
									fileWrite << temp[i];
									i++;
								}
							}

						fileWrite << temp[i];
						i++;

					}
			}

			if (temp[i]!=' ' && temp[i]!='	' && temp[i]!='>') {
				if (temp[i]=='!' && temp[i-1]=='<') {
					fileWrite << temp[i];
				} else if (temp[i]=='&' && temp[i+1]=='#') {
						fileWrite << '&';
						i++;
						fileWrite << '#';

						while (temp[i] != ';') {
							i++;
							fileWrite << temp[i];

						}
				} else {
					cout << temp[i];
					fileWrite << '-';
				}
			} else {
				cout << ' ';
				fileWrite << temp[i];
			}


		}
		fileWrite << endl;
	}

	fileRead.close();
	fileWrite.close();

	return 0;
}
