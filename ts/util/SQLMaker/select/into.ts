import {Base} from '../base'

namespace SQLMaker{
	export enum FileType{
		OUT,DUMP
	}

	export interface test{
		():boolean;
	}

	export class Into extends Base{
		constructor(parent:Base,params:any[]){
			super(parent);
			this.push('INTO');


			if(params.length > 0) {
				if(typeof params[0] == 'number') {
					let fileType = params[0] as FileType;
					if(fileType == FileType.OUT) {
						this.outFile(params[1]);
					}else if(fileType == FileType.DUMP){
						this.dumpFile(params[1]);
					}else{
						throw "Undefined FileType:"+params[1];
					}
				}else{
					this.push(params.join(','));
				}
			}else{
				throw "Miss Params";
			}
		}

		outFile(filePath:string){
			this.push('OUTFILE');
			this.push(filePath);
		}

		dumpFile(filePath:string){
			this.push('DUMPFILE');
			this.push(filePath);
		}
	}
}