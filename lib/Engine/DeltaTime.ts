export class EngineTiming {

}

const val = 12;

class DeltaTime {
    public static getMs() {
        return val;
    }
}

interface DeltaTime {
    [Symbol.toPrimitive](hint: "number"): number;
}


DeltaTime.prototype.valueOf = function () {
    return 0;
}

export const Delta = new DeltaTime();